import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Tenant extends Document {

  @Prop({ required: true })
  name: string;

  @Prop()
  email: string;

  // @Prop({ default: 'active' })
  // status: 'active' | 'suspended' | 'inactive';
}

export const TenantSchema = SchemaFactory.createForClass(Tenant);