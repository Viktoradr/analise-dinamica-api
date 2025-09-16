import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configSwagger } from './config/swagger';
import dotenv from "dotenv";
dotenv.config();
// import { ExpressAdapter } from '@nestjs/platform-express';
// import express from 'express';
// import cors from 'cors';
// import serverless from 'serverless-http';

// const expressApp = express();
// expressApp.use(cors({
//   origin: [
//     'http://localhost:4200', // Desenvolvimento local
//     'https://analise-dinamica.vercel.app'], // Frontend autorizado
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
//   credentials: true
// }));
// const adapter = new ExpressAdapter(expressApp);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: [
      'http://localhost:4200', // Desenvolvimento local
      'https://analise-dinamica.vercel.app'], // Frontend autorizado
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true
  });

  // Habilita CORS
  // Permitir CORS
  // if (process.env.NODE_ENV !== 'production') { 
  //   // Todas as rotas terão prefixo /api
  //   app.setGlobalPrefix('api');
  //   // Configuração do Swagger
  //   configSwagger(app);
  // }

  app.setGlobalPrefix('api');
  configSwagger(app);
  
  
  const PORT = process.env.PORT || 3000;
  // if (process.env.NODE_ENV !== 'production') {
  //   app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  // }

  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  //await app.init();
}
bootstrap();

// export const handler = serverless(expressApp);
