import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configSwagger } from './config/swagger';
import dotenv from "dotenv";
dotenv.config();

import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import cors from 'cors';

const expressApp = express();

// ✅ Configure o CORS aqui
expressApp.use(cors({
  origin: [
    'http://localhost:4200',
    'https://analise-dinamica.vercel.app',
  ],
  methods: ['GET','POST','PUT','DELETE','PATCH','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));

  //const app = await NestFactory.create(AppModule);
  
  // app.enableCors({
  //   origin: [
  //     'http://localhost:4200', // Desenvolvimento local
  //     'https://analise-dinamica.vercel.app'], // Frontend autorizado
  //   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  //   allowedHeaders: ['Content-Type', 'Authorization'],
  //   credentials: true
  // });

  app.setGlobalPrefix('api');
  
  configSwagger(app);

  // Redireciona a raiz "/" para "/api"
  app.getHttpAdapter().get('/', (req, res) => {
    res.redirect('/api');
  });
  
  // const PORT = process.env.PORT || 3000;
  // app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  await app.init();
}
bootstrap();
