import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Agrega el prefijo global "api"
  // app.setGlobalPrefix('api');

  // Habilitar validaciones globalmente
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      // Agrega esta opción para aceptar arrays:
      disableErrorMessages: false,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Habilitar CORS para permitir requests desde el frontend
  app.enableCors({
    origin: process.env.CLIENT_URL, // dominio del frontend permitido
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    //  (opcional, si necesitas headers específicos)
  });

  app.use(cookieParser());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
