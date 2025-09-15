import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function configSwagger(app: INestApplication) {

  const config = new DocumentBuilder()
    .setTitle('API Análise Dinâmica')
    .setDescription('API description')
    .setVersion('1.0')
    .addBearerAuth() // 🔥 habilita botão Authorize
    .build();

    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
}