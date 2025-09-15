import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configSwagger } from './config/swagger';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import serverless from 'serverless-http';

const expressApp = express();
const adapter = new ExpressAdapter(expressApp);

async function bootstrap() {
  const app = await NestFactory.create(AppModule, adapter);
  
  // Habilita CORS
  app.enableCors({
    origin: ['http://localhost:4200', 'http://analise-dinamica.vercel.app'], // domínios permitidos
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true, // se precisar enviar cookies
  });
  
  // Configuração do Swagger
  configSwagger(app);
  
  const PORT = process.env.PORT || 3000;
  if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  }

  await app.init();
}
bootstrap();

export const handler = serverless(expressApp);
