import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LogsModule } from '../auditoria/logs.module';
import { ArquivoController } from './arquivo.controller';
import { ArquivoService } from './arquivo.service';
import { Arquivo, ArquivoSchema } from './schemas/arquivo.schema';
 
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Arquivo.name, schema: ArquivoSchema }]),
    LogsModule
  ],
  controllers: [ArquivoController],
  providers: [ArquivoService],
  exports: [ArquivoService],
})
export class ArquivoModule {}
