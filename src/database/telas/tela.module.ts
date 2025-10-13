import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Tela, TelaSchema } from './schemas/telas.schema';
import { TelaService } from './tela.service';
import { PerfilModule } from '../perfil/perfil.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Tela.name, schema: TelaSchema }]),
        PerfilModule
    ],
    providers: [TelaService],
    exports: [TelaService],
})
export class SessionModule { }
