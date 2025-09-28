import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: false })
export class Session extends Document {
  @Prop({ required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  jwtId: string; // JTI do token

  @Prop({ required: true })
  createdAt: Date;
  
  @Prop({ required: true })
  expiresAt: Date;
  
  @Prop({ required: true })
  lastActivity: Date;
  
  @Prop({ required: true })
  active: Boolean;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
