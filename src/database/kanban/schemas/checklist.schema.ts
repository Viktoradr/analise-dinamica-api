import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ChecklistKanbanDocument = HydratedDocument<ChecklistKanban> & { _id: Types.ObjectId };

@Schema({ timestamps: false })
export class ChecklistKanban {
    @Prop({ lowercase: true, trim: true })
    idItem: string;

    @Prop({ lowercase: true, trim: true })
    task: string;

    @Prop({ type: Boolean, default: false })
    required: boolean;

    @Prop({ type: Number })
    executions: number;
}

export const ChecklistKanbanSchema = SchemaFactory.createForClass(ChecklistKanban);
