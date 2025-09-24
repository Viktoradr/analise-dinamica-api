import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { EventEnum } from '../../../enum/event.enum';

export type AuditLogDocument = AuditLog & Document & { _id: Types.ObjectId };

@Schema({ timestamps: true })
export class AuditLog extends Document {
  @Prop()
  userId: string;

  // @Prop({ required: true })
  // tenantId: string;

  @Prop({ required: true })
  action: string;

  @Prop({ required: true })
  event: EventEnum;

  @Prop({ required: true })
  resource: string;

  @Prop({ type: Object })
  details: Record<string, any>;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);
