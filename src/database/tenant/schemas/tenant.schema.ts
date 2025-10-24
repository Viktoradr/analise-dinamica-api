import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Tenant extends Document {

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String })
  descricao: string;

  @Prop({ type: String })
  email: string;

  @Prop({ type: Boolean, default: true })
  ativo: boolean;

  @Prop({ type: String, required: true, lowercase: true, unique: true })
  codPrefixoInterno: string;

  // pre_set: (tipos, regras, templates)
}

export const TenantSchema = SchemaFactory.createForClass(Tenant);