import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DominioService } from './dominio.service';
import { Dominio, DominioSchema } from './schemas/dominio.schema';
import { DominioController } from './dominio.controller';

@Module({
    imports: [MongooseModule.forFeature([{ name: Dominio.name, schema: DominioSchema }])],
    controllers: [DominioController],
    providers: [DominioService],
    exports: [DominioService],
})
export class DominioModule { }
