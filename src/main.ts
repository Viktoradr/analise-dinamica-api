import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configSwagger } from './config/swagger';
import dotenv from "dotenv";
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const allowedOrigins = [
    'http://localhost:4200',
    'https://analise-dinamica.vercel.app'
  ];

  app.enableCors({
    origin: allowedOrigins
  });

  app.setGlobalPrefix('api');
  
  configSwagger(app);

  // Redireciona a raiz "/" para "/api"
  app.getHttpAdapter().get('/', (req, res) => {
    res.redirect('/api');
  });
  
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
bootstrap();
