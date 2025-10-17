import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ColumnKanban, ColumnKanbanSchema } from './column.schema';
import { TagKanban, TagKanbanSchema } from './tags.schema';

export type KanbanDocument = HydratedDocument<Kanban> & { _id: Types.ObjectId };

@Schema({ timestamps: true })
export class Kanban {

    @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true })
    tenantId: Types.ObjectId;

    @Prop({ required: true, lowercase: true, trim: true })
    cod_name: string;

    @Prop({ lowercase: true, trim: true })
    name: string;

    @Prop({ type: String, trim: true })
    description: string;

    @Prop({ type: Boolean, default: true })
    active: boolean;

    @Prop({ type: String, trim: true })
    status: string;

    @Prop({ type: [{ type: ColumnKanbanSchema }], default: [] })
    columns: Types.Array<ColumnKanban>;
}

export const KanbanSchema = SchemaFactory.createForClass(Kanban);
