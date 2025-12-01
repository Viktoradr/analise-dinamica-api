import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { IntegracaoController } from './integracao.controller';
import { IntegracaoService } from './integracao.service';
import { Integracao, IntegracaoSchema } from './schemas/integracao.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Integracao.name, schema: IntegracaoSchema }])
    ],
    controllers: [
        IntegracaoController,
    ],
    providers: [
        JwtService,
        IntegracaoService,
    ],
    exports: [
        IntegracaoService,
    ]
})
export class IntegracaoModule { }
