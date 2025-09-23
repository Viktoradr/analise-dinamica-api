import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LaudoController } from 'src/database/laudos/laudo.controller';
import { LaudoService } from 'src/database/laudos/laudo.service';
import { Laudo, LaudoSchema } from 'src/database/laudos/schemas/laudo.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Laudo.name, schema: LaudoSchema }])],
  controllers: [LaudoController],
  providers: [LaudoService],
  exports: [LaudoService],
})
export class LaudoModule {}
