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
import { CardKanbanService } from '../kanban/k-cards/cards.service';
import { KanbanModule } from '../kanban/kanban.module';
import { IntegracaoModule } from '../integracoes/integracao.module';
 
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Arquivo.name, schema: ArquivoSchema }]),
    LogsModule,
    UsuarioModule,
    OcrModule,
    AwsBucketModule,
    PdfModule,
    KanbanModule,
    IntegracaoModule
  ],
  controllers: [ArquivoController],
  providers: [ArquivoService],
  exports: [ArquivoService],
})
export class ArquivoModule {}
