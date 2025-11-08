import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Session extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Usuario', required: true })
  userId: Types.ObjectId;
  
  @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true })
  tenantId: Types.ObjectId;

  @Prop({ required: true })
  jwtId: string; // JTI do token

  @Prop({ required: true, default: Date.now })
  createdAt: Date;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop({ required: true })
  lastActivity: Date;

  @Prop({ required: true })
  active: Boolean;

  @Prop({ default: null })
  inactivatedAt: Date;

  @Prop({
    default: null,
    minLength: 6,
    maxlength: 6
  })
  codigo: number;

  @Prop({ type: Object })
  deviceInfo: {
    fingerprint: string;
    serverFingerprint: string;
    platform: string;
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    browser: string;
    os: string;
    screen: string;
    timezone: string;
    language: string;
    userAgent: string;
    ip: {
      xForwardedFor: string;
      xRealIp: string;
      connRemoteAddress: string;
      socketRemoteAddress: string;
      infoRemoteAddress: string;
    }
  };
}

export const SessionSchema = SchemaFactory.createForClass(Session);

SessionSchema.index(
  { userId: 1 },
  { partialFilterExpression: { codigo: { $exists: true } } }
);

SessionSchema.index(
  { codigo: 1 },
  { partialFilterExpression: { codigo: { $exists: true } } }
);