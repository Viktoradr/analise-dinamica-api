import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TemplateDocument = HydratedDocument<Template> & { _id: Types.ObjectId };

@Schema({ timestamps: true })
export class Template {

    @Prop({ type: Types.ObjectId, ref: 'TipoCard', required: true })
    tipoCardId: Types.ObjectId;

    @Prop({ required: true, lowercase: true, trim: true })
    cd_tag: string;

    @Prop({ lowercase: true, trim: true })
    name: string;

    @Prop({ type: String, trim: true })
    description: string;

    @Prop({ type: Object })
    campos: object; //Campos de negócio dinâmicos - {cd_pasta:'A10002', ...}

    @Prop({ type: [Object] })
    raias: Array<{
        name: string;
        order: number;  
        checklist: Array<any>;
        workflow: Array<any>;
    }>;
}

export const TemplateSchema = SchemaFactory.createForClass(Template);
