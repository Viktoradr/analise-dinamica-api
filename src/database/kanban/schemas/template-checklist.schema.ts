import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TemplateChecklistDocument = HydratedDocument<TemplateChecklist> & { _id: Types.ObjectId };

@Schema({ timestamps: false })
export class TemplateChecklist {
    @Prop({ lowercase: true, trim: true })
    codigo: string;

    @Prop({ lowercase: true, trim: true })
    task: string;

    @Prop({ type: Boolean, default: false })
    required: boolean;

    @Prop({ type: Number, default: 0 })
    executions: number;
}

export const TemplateChecklistSchema = SchemaFactory.createForClass(TemplateChecklist);
