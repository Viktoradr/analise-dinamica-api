import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { RoleEnum } from '../../../enum/perfil.enum';
import { TipoCliente, TipoClienteSchema } from '../../tipo-cliente/schemas/tipo-cliente.schema';

export type UsuarioDocument = Usuario & Document & { _id: Types.ObjectId };

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
    default: [RoleEnum.ADM], 
  })
  roles: RoleEnum[];

  @Prop({ default: 0 })
  tentativasErro: number;

  @Prop({ type: Date })
  ultimaTentativaErro: Date;

  @Prop({ type: Date })
  bloqueadoAte: Date;
  
  @Prop({ default: false })
  aceiteTermo: boolean;

  @Prop({ type: Date, default: null })
  aceiteTermoAt: Date;

  @Prop({ type: String, default: 'v1.0' })
  termoVersao: string;

  @Prop({ type: TipoClienteSchema, default: null })
  tipoCliente: TipoCliente;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);

UsuarioSchema.virtual('id').get(function (this: UsuarioDocument) {
  return this._id.toHexString();
});

// Garante que o `id` aparece ao converter para JSON
UsuarioSchema.set('toJSON', { virtuals: true });
UsuarioSchema.set('toObject', { virtuals: true });