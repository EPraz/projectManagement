import { ValidationPipe } from '@nestjs/common';

// Keep HTTP fixtures and the shipped bootstrap on the same explicit contract.
// JSON booleans/numbers must retain their types; DTO @Type handles intentional
// conversions such as date strings without coercing "false" to true.
export const createValidationPipe = () =>
  new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  });
