import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ _id: false, timestamps: false })
export class TipoCardKanban {

    @Prop({ type: Types.ObjectId, ref: 'TipoCard', required: true })
    tipoCardId: Types.ObjectId;

    @Prop({ required: true, lowercase: true, trim: true })
    codigo: string;

    @Prop({ lowercase: true, trim: true })
    name: string;

    @Prop({ type: String, trim: true })
    description: string;
}

export const TipoCardKanbanSchema = SchemaFactory.createForClass(TipoCardKanban);
