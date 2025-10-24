import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ChecklistCardKanbanDocument = HydratedDocument<ChecklistCardKanban> & { _id: Types.ObjectId };

@Schema({ timestamps: false })
export class ChecklistCardKanban {

    @Prop({ type: Types.ObjectId, ref: 'Kanban', required: true })
    kanbanId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, required: true })
    raiaId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, required: true })
    checklistItemId: Types.ObjectId;

    @Prop({ type: Number })
    executionsOk: number;
}

export const ChecklistCardKanbanSchema = SchemaFactory.createForClass(ChecklistCardKanban);
