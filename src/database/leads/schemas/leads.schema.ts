import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Lead {
  @Prop({ 
    required: true, 
    lowercase: true,
    trim: true, 
    minlength: 2, 
    maxlength: 100 
  })
  name: string;

  @Prop({
    unique: true,
    required: true,
    lowercase: true,
    trim: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  })
  email: string;

  @Prop({ default: null })
  phone: string;
  
  @Prop({ default: false })
  isValid: boolean;
  
  @Prop({ type: Date, default: null })
  dtApproved: Date;

  @Prop({ type: Types.ObjectId, ref: 'Usuario', default: null })
  userIdApprovedBy: Types.ObjectId;
  
  @Prop({ type: Types.ObjectId, ref: 'Tenant', default: null })
  tenantIdApprovedBy: Types.ObjectId;

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

export const LeadSchema = SchemaFactory.createForClass(Lead);