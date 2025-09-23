import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { RoleEnum } from '../../../shared/enum/perfil.enum';

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
    unique: true,
    maxLength: 11,
    minLength: 10, 
    default: null
  })
  celular: string;

  @Prop({
    type: [String],
    enum: RoleEnum,
    default: [RoleEnum.ADM], 
  })
  roles: RoleEnum[];

  @Prop({ 
    default: null,
    minLength: 6, 
    maxlength: 6 
  })
  codigo: number;

  @Prop({ 
    type: Date,
    default: null 
  })
  dtCodigo: Date;

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
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);

UsuarioSchema.index(
  { codigo: 1 },
  {
    partialFilterExpression: { codigo: { $exists: true } },
  },
);

UsuarioSchema.virtual('id').get(function (this: UsuarioDocument) {
  return this._id.toHexString();
});

// Garante que o `id` aparece ao converter para JSON
UsuarioSchema.set('toJSON', { virtuals: true });
UsuarioSchema.set('toObject', { virtuals: true });


UsuarioSchema.pre<UsuarioDocument>('save', function (next) {
  if (this.isModified('codigo')) {
    this.dtCodigo = new Date();
  }
  next();
});