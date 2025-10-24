import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { RaiaKanban, RaiaKanbanSchema } from './raia.schema';

export type KanbanDocument = HydratedDocument<Kanban> & { _id: Types.ObjectId };

@Schema({ timestamps: true })
export class Kanban {

    @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true })
    tenantId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'TipoCard', required: true })
    tipoCardId: Types.ObjectId;

    @Prop({ required: true, lowercase: true, trim: true })
    codKanban: string;

    @Prop({ lowercase: true, trim: true })
    name: string;

    @Prop({ type: String, trim: true })
    description: string;

    @Prop({ type: Boolean, default: true })
    active: boolean;

    @Prop({ type: [{ type: RaiaKanbanSchema }], default: [] })
    raias: Types.Array<RaiaKanban>;
}

export const KanbanSchema = SchemaFactory.createForClass(Kanban);
