import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Habilitar validaciones globalmente
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades no definidas en los DTOs
      forbidNonWhitelisted: true, // Lanza error si se envían propiedades no permitidas
      transform: true, // Convierte automáticamente los tipos de datos
    }),
  );

  // ✅ Habilitar CORS para permitir requests desde el frontend
  app.enableCors({
    origin: 'http://localhost:5173', // ⚠️ Asegúrate de que este es el puerto de tu React/Vite
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Si en el futuro usas cookies/session, deja esto en true
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
