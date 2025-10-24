import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ChecklistKanban, ChecklistKanbanSchema } from './checklist.schema';

export type RaiaKanbanDocument = HydratedDocument<RaiaKanban> & { _id: Types.ObjectId };

@Schema({ timestamps: true })
export class RaiaKanban {

    @Prop({ lowercase: true, trim: true })
    name: string;

    @Prop({ type: Number })
    order: number;

    @Prop({ type: [{ type: ChecklistKanbanSchema }] })
    checklist: Types.Array<ChecklistKanban>;
}

export const RaiaKanbanSchema = SchemaFactory.createForClass(RaiaKanban);
