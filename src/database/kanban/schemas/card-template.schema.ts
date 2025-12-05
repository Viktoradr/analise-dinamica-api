import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { CamposPersonagemCardKanban, CamposPersonagemCardKanbanSchema } from './card-campos-personagem.schema';

@Schema({ _id: false, timestamps: false })
export class CardTemplateKanban {

    @Prop({ type: Types.ObjectId, ref: 'CardTemplate', required: true })
    templateCardId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'TipoCard', required: true })
    tipoCardId: Types.ObjectId;

    @Prop({ lowercase: true, trim: true })
    name: string;

    @Prop({ type: String, trim: true })
    description: string;

    @Prop({ type: Object })
    campos: object; 

    @Prop({ type: [CamposPersonagemCardKanbanSchema] })
    camposPersonagem: CamposPersonagemCardKanban[]; 
}

export const CardTemplateKanbanSchema = SchemaFactory.createForClass(CardTemplateKanban);
