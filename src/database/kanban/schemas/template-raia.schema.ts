import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { TemplateWorkflowSchema, TemplateWorkflow } from './template-workflow.schema';
import { TemplateChecklist, TemplateChecklistSchema } from './template-checklist.schema';

export type TemplateRaiaDocument = HydratedDocument<TemplateRaia> & { _id: Types.ObjectId };

@Schema({ timestamps: false })
export class TemplateRaia {
    @Prop({ type: Number })
    etapa: number;

    @Prop({ type: [TemplateChecklistSchema] })
    checklist: Types.Array<TemplateChecklist>;
    
    @Prop({ type: [TemplateWorkflowSchema] })
    workflow: Types.Array<TemplateWorkflow>;
}

export const TemplateRaiaSchema = SchemaFactory.createForClass(TemplateRaia);
