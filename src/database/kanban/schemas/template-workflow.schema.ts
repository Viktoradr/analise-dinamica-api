import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TemplateWorkflowDocument = HydratedDocument<TemplateWorkflow> & { _id: Types.ObjectId };

@Schema({ timestamps: false })
export class TemplateWorkflow {
    @Prop({ lowercase: true, trim: true })
    codigo: string;

    @Prop({ lowercase: true, trim: true })
    task: string;

    @Prop({ type: Boolean, default: false })
    required: boolean;
}

export const TemplateWorkflowSchema = SchemaFactory.createForClass(TemplateWorkflow);
