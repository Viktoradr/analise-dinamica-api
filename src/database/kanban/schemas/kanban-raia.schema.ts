import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ _id: false, timestamps: false })
export class KanbanRaia {

    @Prop({ type: Types.ObjectId, required: true })
    id: Types.ObjectId;

    @Prop({ lowercase: true, trim: true })
    name: string;

    @Prop({ type: Number, required: true })
    order: number;
}

export const KanbanRaiaSchema = SchemaFactory.createForClass(KanbanRaia);
