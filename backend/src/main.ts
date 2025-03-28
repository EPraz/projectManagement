import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar validaciones globalmente
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      disableErrorMessages: false,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Habilitar CORS para permitir requests desde el frontend
  app.enableCors({
    origin: process.env.CLIENT_URL || '*', // Fly.io no necesita esto si sirves el frontend
    credentials: true,
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: 'Content-Type, Authorization',
  });

  app.use(cookieParser());

  // Escuchar en 0.0.0.0 para Fly.io
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
