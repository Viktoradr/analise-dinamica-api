import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UsuarioDocument = Permissao & Document & { _id: Types.ObjectId };

@Schema({ timestamps: true })
export class Permissao extends Document {
  @Prop({ required: true })
  perfil: string;

  @Prop({ required: true })
  descricao: string;

  @Prop({ type: Object })
  acoes: Record<string, any>;
}

export const PermissaoSchema = SchemaFactory.createForClass(Permissao);
