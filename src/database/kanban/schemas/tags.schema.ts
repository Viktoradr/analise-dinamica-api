import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { PrioridadeEnum } from '../../../enum/prioridade.enum';

export type TagKanbanDocument = HydratedDocument<TagKanban> & { _id: Types.ObjectId };

@Schema({ timestamps: true })
export class TagKanban {

    @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true })
    tenantId: Types.ObjectId;

    @Prop({ required: true, lowercase: true, trim: true })
    codigo: string;

    @Prop({ lowercase: true, trim: true })
    name: string;

    @Prop({ type: String, trim: true })
    description: string;

    @Prop({
        type: String,
        enum: PrioridadeEnum,
        trim: true
    })
    priority: PrioridadeEnum;

    @Prop({
        required: true,
        uppercase: true,
        trim: true,
        type: String
    })
    colorHex: string;

    @Prop({ type: Boolean, default: true })
    active: boolean;

    @Prop({ type: Types.ObjectId, ref: 'Usuario', required: true })
    createdBy: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Usuario', default: null })
    updatedBy: Types.ObjectId;

}

export const TagKanbanSchema = SchemaFactory.createForClass(TagKanban);
