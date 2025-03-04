import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
    origin: 'http://localhost:5173', // ⚠️ Asegúrate de que este es el puerto de tu React/Vite
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Si en el futuro usas cookies/session, deja esto en true
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
