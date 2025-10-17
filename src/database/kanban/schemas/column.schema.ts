import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ChecklistKanban, ChecklistKanbanSchema } from './checklist.schema';

export type ColumnKanbanDocument = HydratedDocument<ColumnKanban> & { _id: Types.ObjectId };

@Schema({ timestamps: true })
export class ColumnKanban {

    @Prop({ lowercase: true, trim: true })
    name: string;

    @Prop({ type: Number })
    order: number;

    @Prop({ type: [{ type: ChecklistKanbanSchema }] })
    checklist: Types.Array<ChecklistKanban>;
}

export const ColumnKanbanSchema = SchemaFactory.createForClass(ColumnKanban);
