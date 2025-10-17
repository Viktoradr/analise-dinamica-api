import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { StatusCardKanban, StatusCardKanbanSchema } from './card-status.schema';
import { HistTranCardKanban, HistTranCardKanbanSchema } from './card-hist-trans.schema';
import { ChecklistExecCardKanban, ChecklistExecCardKanbanSchema } from './card-checklist-exec.schema';

export type CardKanbanDocument = HydratedDocument<CardKanban> & { _id: Types.ObjectId };

@Schema({ timestamps: true })
export class CardKanban {

    @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true })
    tenantId: Types.ObjectId;

    @Prop({ type: [Types.ObjectId], ref: 'Kanban', required: true })
    kanbans: Types.Array<Types.ObjectId>;

    @Prop({ lowercase: true, trim: true })
    name: string;

    @Prop({ lowercase: true, trim: true })
    identifier: string;

    @Prop({ lowercase: true, trim: true })
    codName: string;

    @Prop({ type: Boolean, default: true })
    active: boolean;

    @Prop({ type: [Types.ObjectId], ref: 'Tags', default: [] })
    tags: Types.Array<Types.ObjectId>;

    @Prop({ type: StatusCardKanbanSchema, default: null })
    status: StatusCardKanban;

    @Prop({ type: [HistTranCardKanbanSchema], default: [] })
    histTransitions: Types.Array<HistTranCardKanban>;

    @Prop({ type: [ChecklistExecCardKanbanSchema], default: [] })
    checklistExec: Types.Array<ChecklistExecCardKanban>;

    @Prop({ type: [Types.ObjectId], ref: 'Arquivo', required: true })
    arquivos: Types.Array<Types.ObjectId>;

    @Prop({ type: Types.ObjectId, ref: 'Usuario', required: true })
    createdBy: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Usuario', default: null })
    updatedBy: Types.ObjectId;
}

export const CardKanbanSchema = SchemaFactory.createForClass(CardKanban);
