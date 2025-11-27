import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type HistActivCardKanbanDocument = HydratedDocument<HistActivCardKanban> & { _id: Types.ObjectId };

@Schema({ timestamps: false })
export class HistActivCardKanban {

    @Prop({ type: Types.ObjectId, ref: 'Kanban', required: true })
    kanbanId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, required: true })
    raiaId:Types.ObjectId;

    @Prop({ required: true })
    createdAt: Date;

    @Prop({ type: Types.ObjectId, ref: 'Usuario', default: null })
    createdBy: Types.ObjectId;

    @Prop({ type: String, required: true })
    description: string;
}

export const HistActivCardKanbanSchema = SchemaFactory.createForClass(HistActivCardKanban);
