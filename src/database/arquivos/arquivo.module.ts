import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LogsModule } from '../auditoria/logs.module';
import { ArquivoController } from './arquivo.controller';
import { ArquivoService } from './arquivo.service';
import { Arquivo, ArquivoSchema } from './schemas/arquivo.schema';
import { UsuarioModule } from '../usuario/usuario.module';
import { OcrModule } from '../../providers/ocr/ocr.module';
import { AwsBucketModule } from '../../providers/aws/aws-bucket.module';
import { PdfModule } from '../../providers/pdf/pdf.module';
 
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Arquivo.name, schema: ArquivoSchema }]),
    LogsModule,
    UsuarioModule,
    OcrModule,
    AwsBucketModule,
    PdfModule
  ],
  controllers: [ArquivoController],
  providers: [ArquivoService],
  exports: [ArquivoService],
})
export class ArquivoModule {}
