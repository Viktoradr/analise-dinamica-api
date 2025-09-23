import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LaudoController } from './laudo.controller';
import { LaudoService } from './laudo.service';
import { Laudo, LaudoSchema } from './schemas/laudo.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Laudo.name, schema: LaudoSchema }])],
  controllers: [LaudoController],
  providers: [LaudoService],
  exports: [LaudoService],
})
export class LaudoModule {}
