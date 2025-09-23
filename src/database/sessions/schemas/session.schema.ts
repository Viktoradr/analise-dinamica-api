import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Session extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  jwtId: string; // JTI do token
  
  @Prop({ required: true })
  expiresAt: Date;

  @Prop({ required: true })
  lastActivity: Date; // Para inatividade
}

export const SessionSchema = SchemaFactory.createForClass(Session);
