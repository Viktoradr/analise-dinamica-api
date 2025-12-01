import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { TipoPessoaEnum } from 'src/enum/tipoPessoa.enum';
import { VinculoPersonagem, VinculoPersonagemSchema } from './vinculo.schema';

export type PersonagemDocument = HydratedDocument<Personagem> & { _id: Types.ObjectId };

@Schema({ timestamps: true })
export class Personagem {
    @Prop({
        type: String,
        enum: TipoPessoaEnum,
        default: TipoPessoaEnum.PF
    })
    tipoPessoa: TipoPessoaEnum;

    @Prop({
        lowercase: true,
        trim: true,
        minlength: 2
    })
    nome: string;

    @Prop({ trim: true })
    cpfCnpj: string;

    @Prop({ type: Date, default: null })
    dataNascimento: Date | null;

    @Prop({ lowercase: true, trim: true })
    estadoCivil: string;

    @Prop({ lowercase: true, trim: true })
    profissao: string;

    @Prop({ lowercase: true, trim: true })
    nacionalidade: string;

    @Prop({ lowercase: true, trim: true })
    regime: string;

    @Prop({
        lowercase: true,
        trim: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    })
    email: string;

    @Prop({ default: null })
    contato: string;

    @Prop({ type: Object })
    filiacao: {
        nomeMae: string;
        nomePai: string;
    };

    @Prop({ type: Object })
    endereco: {
        logradouro: string;
        bairro: string;
        cidade: string;
        uf: string;
        cep: string;
    };

    @Prop({ type: Object })
    identidade: {
        numero: string;
        orgao: string;
        uf: string;
    };

    @Prop({ type: Object })
    restricoesEspeciais: {
        possuiRestricao: boolean;
        tipos: string[];
    };

    @Prop({ type: Object })
    papel: {
        descricao: string;
        dataInicio: string;
        dataFim: string;
        observacao: string;
        fonteInformacao: string;
    };

    @Prop({ type: [VinculoPersonagemSchema], default: [] })
    vinculos: Types.Array<VinculoPersonagem>;
}

export const PersonagemSchema = SchemaFactory.createForClass(Personagem);
