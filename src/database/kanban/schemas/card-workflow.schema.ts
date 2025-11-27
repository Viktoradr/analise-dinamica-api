import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type WorkflowCardKanbanDocument = HydratedDocument<WorkflowCardKanban> & { _id: Types.ObjectId };

@Schema({ timestamps: false })
export class WorkflowCardKanban {

    @Prop({ type: Types.ObjectId, required: true })
    raiaId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, required: true })
    checklistItemId: Types.ObjectId;
    
    @Prop({ type: String, trim: true })
    name: string;
    
    @Prop({ type: Boolean, default: false })
    check: boolean;

    @Prop({ type: Date, default: null })
    baixaAt: Date | null; 
}

export const WorkflowCardKanbanSchema = SchemaFactory.createForClass(WorkflowCardKanban);
