import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { RoleEnum } from '../../../enum/perfil.enum';
import { TipoCliente, TipoClienteSchema } from '../../tipo-cliente/schemas/tipo-cliente.schema';

export type UsuarioDocument = HydratedDocument<Usuario> & { _id: Types.ObjectId };

@Schema({ timestamps: true })
export class Usuario {
  @Prop({ 
    required: true, 
    lowercase: true,
    trim: true, 
    minlength: 2, 
    maxlength: 100 
  })
  nome: string;

  @Prop({
    unique: true,
    required: true,
    lowercase: true,
    trim: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  })
  email: string;

  @Prop({
    default: null
  })
  celular: string;

  @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true })
  tenantId: Types.ObjectId;

  @Prop({
    type: [String],
    enum: RoleEnum,
    default: [], 
  })
  roles: RoleEnum[];

  @Prop({ default: 0 })
  tentativasErro: number;

  @Prop({ type: Date })
  ultimaTentativaErro: Date;

  @Prop({ type: Date, default: null })
  bloqueadoAte: Date | null;
  
  @Prop({ default: false })
  aceiteTermo: boolean;

  @Prop({ type: Date, default: null })
  aceiteTermoAt: Date | null;

  @Prop({ type: String, default: 'v1.0' })
  termoVersao: string;

  @Prop({ type: TipoClienteSchema, default: null })
  tipoCliente: TipoCliente;

  @Prop({ type: Boolean, default: true })
  ativo: boolean;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);
