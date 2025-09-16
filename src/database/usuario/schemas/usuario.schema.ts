import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { PerfilEnum } from '../../../shared/enum/perfil.enum';

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
  name: string;

  @Prop({
    unique: true,
    required: true,
    lowercase: true,
    trim: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  })
  email: string;

  @Prop({
    enum: [PerfilEnum.ADMIN, PerfilEnum.USER, PerfilEnum.BACKOFFICE],
    default: PerfilEnum.USER,
  })
  perfil: string;

  @Prop({ 
    default: null,
    minLength: 6, 
    maxlength: 6 
  })
  codigo: number;

  @Prop({ default: null })
  dtCodigo: Date;
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

UsuarioSchema.virtual('isAdmin').get(function () {
  return this.perfil === 'admin';
});

UsuarioSchema.pre<UsuarioDocument>('save', function (next) {
  if (this.isModified('codigo')) {
    this.dtCodigo = new Date();
  }
  next();
});