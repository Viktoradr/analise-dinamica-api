import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configSwagger } from './config/swagger';
import dotenv from "dotenv";
import { ValidationPipe } from '@nestjs/common';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const allowedOrigins = [
    'http://localhost:4200',
    'https://analise-dinamica.vercel.app'
  ];

  //app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: allowedOrigins
  });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe({
    transform: true, // Importante para transformar strings em Date
  }));
  
  configSwagger(app);

  //Redireciona a raiz "/" para "/api"
  app.getHttpAdapter().get('/', (req, res) => {
    res.redirect('/api-docs'); // ou para onde você quer redirecionar
  });
  
  const PORT = process.env.PORT || 3000;
  app.listen(PORT);
}
bootstrap();
