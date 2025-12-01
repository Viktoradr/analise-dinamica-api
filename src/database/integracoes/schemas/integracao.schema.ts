import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type IntegracaoDocument = HydratedDocument<Integracao> & { _id: Types.ObjectId };

@Schema({ timestamps: true })
export class Integracao {
    @Prop({ trim: true })
    name: string;

    @Prop({ trim: true })
    description: string;

    @Prop({ trim: true })
    apiKey: string;

    @Prop({ trim: true })
    password: string;

    @Prop({ trim: true })
    account: string;

    @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true })
    tenantId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Usuario', required: true })
    createdBy: Types.ObjectId;
}

export const IntegracaoSchema = SchemaFactory.createForClass(Integracao);
