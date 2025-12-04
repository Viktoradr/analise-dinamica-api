import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Tenant extends Document {

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: String })
  email: string;

  @Prop({ type: Boolean, default: true })
  active: boolean;

  @Prop({ type: String, required: true, lowercase: true, unique: true })
  codPrefixoInterno: string;

  @Prop({ type: Object})
  preSet: object; 
}

export const TenantSchema = SchemaFactory.createForClass(Tenant);