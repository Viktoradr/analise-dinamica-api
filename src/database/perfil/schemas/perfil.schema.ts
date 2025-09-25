import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { Permissao, PermissaoSchema } from '../../permissoes/schemas/permissao.schema';
import { Restricoes, RestricoesSchema } from '../../restricoes/schemas/restricoes.schema';

export type PerfilDocument = HydratedDocument<Perfil> & { _id: Types.ObjectId };

@Schema({ collection: 'perfis', timestamps: true })
export class Perfil extends Document {
  @Prop({ required: true })
  nome: string;

  @Prop({ required: true })
  descricao: string;

  @Prop({ type: [PermissaoSchema] })
  permissoes: Permissao[];

  @Prop({ type: [RestricoesSchema] })
  restricoes: Restricoes[];
}

export const PerfilSchema = SchemaFactory.createForClass(Perfil);
