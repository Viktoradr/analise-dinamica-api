import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CodigoService } from './codigos.service';
import { Codigo, CodigoSchema } from './schemas/codigo.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Codigo.name, schema: CodigoSchema }])],
  providers: [CodigoService],
  exports: [CodigoService],
})
export class CodigoModule {}
