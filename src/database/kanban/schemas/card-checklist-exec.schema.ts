import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ChecklistExecCardKanbanDocument = HydratedDocument<ChecklistExecCardKanban> & { _id: Types.ObjectId };

@Schema({ timestamps: false })
export class ChecklistExecCardKanban {

    @Prop({ type: Types.ObjectId, ref: 'Kanban', required: true })
    kanbanId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, required: true })
    columnId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, required: true })
    checklistItemId: Types.ObjectId;

    @Prop({ type: Number })
    executionsOk: number;
}

export const ChecklistExecCardKanbanSchema = SchemaFactory.createForClass(ChecklistExecCardKanban);
