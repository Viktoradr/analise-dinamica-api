import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PermissaoDocument = Permissao & Document & { _id: Types.ObjectId };

@Schema({ collection: 'permissoes',  timestamps: true })
export class Permissao extends Document {
  @Prop({ required: true })
  nome: string;

  @Prop({ required: true })
  descricao: string;
}

export const PermissaoSchema = SchemaFactory.createForClass(Permissao);
