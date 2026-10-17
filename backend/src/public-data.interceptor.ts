import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

export function omitCredentials(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(omitCredentials);
  if (value && typeof value === 'object' && !(value instanceof Date)) {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([key]) => key !== 'password' && key !== 'refreshToken')
        .map(([key, item]) => [key, omitCredentials(item)]),
    );
  }
  return value;
}

@Injectable()
export class PublicDataInterceptor implements NestInterceptor {
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    return next.handle().pipe(map(omitCredentials));
  }
}
