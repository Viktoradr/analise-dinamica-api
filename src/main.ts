import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configSwagger } from './config/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilita CORS
  app.enableCors({
    origin: ['http://localhost:4200', 'http://analise-dinamica.vercel.app'], // domínios permitidos
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true, // se precisar enviar cookies
  });
  
  // Configuração do Swagger
  configSwagger(app);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
