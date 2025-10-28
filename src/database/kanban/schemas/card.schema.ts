import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { HistActivCardKanbanSchema } from './card-hist-activ.schema';
import { StatusCardEnum } from '../../../enum/status-card.enum';
import { HistMovCardKanban, HistMovCardKanbanSchema } from './card-hist-mov.schema';
import { ChecklistCardKanban, ChecklistCardKanbanSchema } from './card-checklist.schema';
import { WorkflowCardKanban, WorkflowCardKanbanSchema } from './card-workflow.schema';

export type CardKanbanDocument = HydratedDocument<CardKanban> & { _id: Types.ObjectId };

@Schema({ timestamps: true })
export class CardKanban {

    @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true })
    tenantId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Kanban', required: true })
    kanbanId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'TipoCard', required: true })
    tipoCardId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'CardTemplate', required: true })
    templateId: Types.ObjectId;

    @Prop({ type: Types.ObjectId })
    atualRaiaId: Types.ObjectId; //ref: KanbanRaia

    @Prop({ uppercase: true, trim: true, required: true })
    codInterno: string; //ARP-MIN-2025-000123

    @Prop({ lowercase: true, trim: true })
    codNegocio: string; //1004395-14.2024.8.26.0572

    @Prop({ type: Boolean, default: true })
    active: boolean;

    @Prop({ type: [Types.ObjectId], ref: 'Tags', default: [] })
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
    checklist: Types.Array<ChecklistCardKanban>; //[{id:'upload_cnh_locatario', status:'pendente'}]

    @Prop({ type: [WorkflowCardKanbanSchema], default: [] })
    workflow: Types.Array<WorkflowCardKanban>; //[{id:'gerar_minuta_modelo', agente:'LLM', status:'ok'}]

    @Prop({ type: [HistMovCardKanbanSchema], default: [] })
    historyMovement: Types.Array<HistMovCardKanban>;

    @Prop({ type: [HistActivCardKanbanSchema], default: [] })
    historyActivities: Types.Array<HistMovCardKanban>;

    @Prop({ type: Object })
    campos: object; //Campos de negócio dinâmicos - {cd_pasta:'A10002', ...}

    @Prop({ type: Types.ObjectId, ref: 'Usuario', required: true })
    createdBy: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Usuario', default: null })
    updatedBy: Types.ObjectId;

    @Prop({ default: null })
    finalizedAt: Date | null; //Conclusão permanente
}

export const CardKanbanSchema = SchemaFactory.createForClass(CardKanban);