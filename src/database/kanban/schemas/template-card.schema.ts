import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { TemplateRaiaSchema, TemplateRaia } from './template-raia.schema';
import { CamposPersonagemCardKanbanSchema, CamposPersonagemCardKanban } from './card-campos-personagem.schema';

export type CardTemplateDocument = HydratedDocument<CardTemplate> & { _id: Types.ObjectId };

@Schema({ timestamps: true })
export class CardTemplate {

    @Prop({ type: Types.ObjectId, ref: 'TipoCard', required: true })
    tipoCardId: Types.ObjectId;

    @Prop({ lowercase: true, trim: true })
    name: string;

    @Prop({ type: String, trim: true })
    description: string;

    @Prop({ type: Object })
    campos: object; 

    @Prop({ type: [CamposPersonagemCardKanbanSchema] })
    camposPersonagem: Types.Array<CamposPersonagemCardKanban>; 

    @Prop({ type: [TemplateRaiaSchema] })
    etapas: Types.Array<TemplateRaia>;
}

export const CardTemplateSchema = SchemaFactory.createForClass(CardTemplate);
