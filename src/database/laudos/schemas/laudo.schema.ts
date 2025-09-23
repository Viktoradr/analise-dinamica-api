import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Laudo extends Document {
  @Prop({ required: true })
  tenantId: string;

  @Prop({ required: true })
  ownerId: string;

  @Prop({ required: true })
  status: 'FINALIZADO' | 'PROCESSANDO' | 'REPROCESSO_SOLICITADO' | 'REPROCESSADO';
}

export const LaudoSchema = SchemaFactory.createForClass(Laudo);