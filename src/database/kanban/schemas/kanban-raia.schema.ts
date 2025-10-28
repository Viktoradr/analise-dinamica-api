import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type KanbanRaiaDocument = HydratedDocument<KanbanRaia> & { _id: Types.ObjectId };

@Schema({ timestamps: true })
export class KanbanRaia {

    @Prop({ lowercase: true, trim: true })
    name: string;

    @Prop({ type: Number })
    order: number;
}

export const KanbanRaiaSchema = SchemaFactory.createForClass(KanbanRaia);
