import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { HistActivCardKanbanSchema } from './card-hist-activ.schema';
import { StatusCardEnum } from '../../../enum/status-card.enum';
import { HistMovCardKanban, HistMovCardKanbanSchema } from './card-hist-mov.schema';
import { ChecklistCardKanban, ChecklistCardKanbanSchema } from './card-checklist.schema';
import { WorkflowCardKanban, WorkflowCardKanbanSchema } from './card-workflow.schema';
import { TipoCardKanban, TipoCardKanbanSchema } from './card-tipocard.schema';
import { CardTemplateKanban, CardTemplateKanbanSchema } from './card-template.schema';
import { KanbanRaia, KanbanRaiaSchema } from './kanban-raia.schema';

export type CardKanbanDocument = HydratedDocument<CardKanban> & { _id: Types.ObjectId };

@Schema({ timestamps: true })
export class CardKanban {

    @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true })
    tenantId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Kanban', required: true })
    kanbanId: Types.ObjectId;

    @Prop({ type: TipoCardKanbanSchema, required: true })
    tipoCard: TipoCardKanban;

    @Prop({ type: CardTemplateKanbanSchema, required: true })
    cardTemplate: CardTemplateKanban;

    @Prop({ type: KanbanRaiaSchema })
    atualRaia: KanbanRaia;

    @Prop({ uppercase: true, trim: true, required: true })
    codInterno: string;

    @Prop({ lowercase: true, trim: true })
    codNegocio: string;

    @Prop({ type: Boolean, default: true })
    active: boolean;

    @Prop({ type: [Types.ObjectId], ref: 'TagKanban', default: [] })
    tags: Types.Array<Types.ObjectId>;

    @Prop({ type: [Types.ObjectId], ref: 'Arquivo', default: [] })
    arquivos: Types.Array<Types.ObjectId>;

    @Prop({ 
        type: String, 
        enum: StatusCardEnum, 
        trim: true,
        default: StatusCardEnum.EM_ANDAMENTO 
    })
    status: StatusCardEnum;

    @Prop({ type: [ChecklistCardKanbanSchema], default: [] })
    checklist: Types.Array<ChecklistCardKanban>;

    @Prop({ type: [WorkflowCardKanbanSchema], default: [] })
    workflow: Types.Array<WorkflowCardKanban>;

    @Prop({ type: [HistMovCardKanbanSchema], default: [] })
    historyMovement: Types.Array<HistMovCardKanban>;

    @Prop({ type: [HistActivCardKanbanSchema], default: [] })
    historyActivities: Types.Array<HistMovCardKanban>;

    @Prop({ type: Types.ObjectId, ref: 'Usuario', required: true })
    createdBy: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Usuario', default: null })
    updatedBy: Types.ObjectId;

    @Prop({ type: Date, default: null })
    finalizedAt: Date | null; //Conclusão permanente
}

export const CardKanbanSchema = SchemaFactory.createForClass(CardKanban);

CardKanbanSchema.index({ tenantId: 1, kanbanId: 1 });

// 🔥 Virtuals (se precisar de relacionamentos)
CardKanbanSchema.virtual('tenant', {
  ref: 'Tenant',
  localField: 'tenantId',
  foreignField: '_id',
  justOne: true
});

CardKanbanSchema.virtual('kanban', {
  ref: 'Kanban',
  localField: 'kanbanId',
  foreignField: '_id',
  justOne: true
});