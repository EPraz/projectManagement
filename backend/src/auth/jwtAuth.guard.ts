import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authHeader = request.headers.get('authorization');

    if (!authHeader || typeof authHeader !== 'string') {
      throw new UnauthorizedException(
        'Missing or invalid authorization header',
      );
    }

    try {
      const token = authHeader.split(' ')[1];
      const decodedToken = this.jwtService.verify<JwtPayload>(token);

      request.user = decodedToken;
      return true;
      // request.user = this.jwtService.verify(token);
      // return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
