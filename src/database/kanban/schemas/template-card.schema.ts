import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { TemplateChecklist, TemplateChecklistSchema } from './template-checklist.schema';
import { TemplateWorkflow, TemplateWorkflowSchema } from './template-workflow.schema';

export type CardTemplateDocument = HydratedDocument<CardTemplate> & { _id: Types.ObjectId };

@Schema({ timestamps: true })
export class CardTemplate {

    @Prop({ type: Types.ObjectId, ref: 'TipoCard', required: true })
    tipoCardId: Types.ObjectId;

    @Prop({ lowercase: true, trim: true })
    name: string;

    @Prop({ type: String, trim: true })
    description: string;

    @Prop({ type: Object })
    campos: object; //Campos de negócio dinâmicos - {cd_pasta:'A10002', ...}

    @Prop({ type: [TemplateChecklistSchema] })
    checklist: Types.Array<TemplateChecklist>;
    
    @Prop({ type: [TemplateWorkflowSchema] })
    workflow: Types.Array<TemplateWorkflow>;
}

export const CardTemplateSchema = SchemaFactory.createForClass(CardTemplate);
