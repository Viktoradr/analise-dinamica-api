import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type VinculoPersonagemDocument = HydratedDocument<VinculoPersonagem> & { _id: Types.ObjectId };

@Schema({ timestamps: false })
export class VinculoPersonagem {

    @Prop({ type: Types.ObjectId, ref: 'Personagem', required: true })
    idRelacionado: Types.ObjectId;

    @Prop({ type: String, required: true })
    tipoVinculo: string;

    @Prop({ type: String, required: true })
    observacao: string;
}

export const VinculoPersonagemSchema = SchemaFactory.createForClass(VinculoPersonagem);
