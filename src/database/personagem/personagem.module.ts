import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { VinculoPersonagem, VinculoPersonagemSchema } from './schemas/vinculo.schema';
import { Personagem, PersonagemSchema } from './schemas/personagem.schema';
import { PersonagemController } from './personagem.controller';
import { PersonagemService } from './personagem.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Personagem.name, schema: PersonagemSchema }]),
        MongooseModule.forFeature([{ name: VinculoPersonagem.name, schema: VinculoPersonagemSchema }])
    ],
    controllers: [
        PersonagemController,
    ],
    providers: [
        JwtService,
        PersonagemService,
    ],
    exports: [
        PersonagemService,
    ]
})
export class PersonagemModule { }
