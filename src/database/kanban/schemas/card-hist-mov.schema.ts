import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type HistMovCardKanbanDocument = HydratedDocument<HistMovCardKanban> & { _id: Types.ObjectId };

@Schema({ timestamps: false })
export class HistMovCardKanban {

    @Prop({ type: Types.ObjectId, ref: 'TipoCard', required: true })
    tipoCardId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'CardTemplate', required: true })
    cardTemplateId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Kanban', required: true })
    kanbanId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, required: true })
    raiaId: Types.ObjectId;

    @Prop({ required: true })
    movementAt: Date;

    @Prop({ type: [String], required: true })
    checklists_snapshot: string[];

    @Prop({ type: [String], required: true })
    workflow_snapshot: string[];
}

export const HistMovCardKanbanSchema = SchemaFactory.createForClass(HistMovCardKanban);
