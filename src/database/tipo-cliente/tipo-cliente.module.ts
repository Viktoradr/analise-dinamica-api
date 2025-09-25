import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LogsModule } from '../auditoria/logs.module';
import { TipoCliente, TipoClienteSchema } from './schemas/tipo-cliente.schema';
import { TipoClienteService } from './tipo-cliente.service';
import { TipoClienteController } from './tipo-cliente.controller';
 
@Module({
  imports: [
    MongooseModule.forFeature([{ name: TipoCliente.name, schema: TipoClienteSchema }]),
    LogsModule
  ],
  controllers: [TipoClienteController],
  providers: [TipoClienteService],
  exports: [TipoClienteService],
})
export class TipoClienteModule {}
