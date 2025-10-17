import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type HistTranCardKanbanDocument = HydratedDocument<HistTranCardKanban> & { _id: Types.ObjectId };

@Schema({ timestamps: false })
export class HistTranCardKanban {

    @Prop({ type: Types.ObjectId, ref: 'Kanban', required: true })
    kanbanId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, required: true })
    columnMovementBy: Types.ObjectId;

    @Prop({ type: Types.ObjectId, required: true })
    columnMovementTo: Types.ObjectId;

    @Prop({ type: Types.ObjectId, required: true })
    columnId:Types.ObjectId;

    @Prop({ required: true })
    movementAt: Date;

    @Prop({ type: Types.ObjectId, ref: 'Usuario', required: true })
    createdBy: Types.ObjectId;

    @Prop({ type: String, trim: true })
    comment: string;
}

export const HistTranCardKanbanSchema = SchemaFactory.createForClass(HistTranCardKanban);
