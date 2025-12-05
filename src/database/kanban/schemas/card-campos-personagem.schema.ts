import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: false })
export class CamposPersonagemCardKanban {

    @Prop({ type: String })
    grupo: string;

    @Prop({ type: [String] })
    values: string[];
}

export const CamposPersonagemCardKanbanSchema = SchemaFactory.createForClass(CamposPersonagemCardKanban);
