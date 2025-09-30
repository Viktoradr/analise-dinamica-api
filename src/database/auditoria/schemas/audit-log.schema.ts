import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { EventEnum } from '../../../enum/event.enum';
import { LogsObrigatorioEnum } from '../../../enum/logs-obrigatorio.enum';

export type AuditLogDocument = HydratedDocument<AuditLog> & { _id: Types.ObjectId };

@Schema({ timestamps: true })
export class AuditLog extends Document {

  @Prop({ required: true })
  event: EventEnum;

  @Prop()
  type: LogsObrigatorioEnum;

  @Prop({ default: null })
  userId: string;

  @Prop({ default: null })
  tenantId: string;

  @Prop({ required: true })
  action: string;

  @Prop({ required: true })
  method: string;

  @Prop({ required: true })
  message: string;

  @Prop({ type: Object })
  details: Record<string, any>;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);
