import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type StatusCardKanbanDocument = HydratedDocument<StatusCardKanban> & { _id: Types.ObjectId };

@Schema({ timestamps: false })
export class StatusCardKanban {

    @Prop({ type: Types.ObjectId, ref: 'Usuario', required: true })
    lastMovementBy: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Kanban', required: true })
    kanbanId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, required: true })
    columnId:Types.ObjectId;

    @Prop({ required: true })
    createdAt: Date;
}

export const StatusCardKanbanSchema = SchemaFactory.createForClass(StatusCardKanban);
