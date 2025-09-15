import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UsuarioDocument = Usuario & Document & { _id: Types.ObjectId };

@Schema({ timestamps: true })
export class Usuario {
  @Prop({ required: true, trim: true, minlength: 2, maxlength: 100 })
  name: string;

  @Prop({
    unique: true,
    required: true,
    lowercase: true,
    trim: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // regex simples para validar email
  })
  email: string;

  @Prop({
    enum: ['admin', 'user', 'backoffice'], // restringe perfis permitidos
    default: 'user',
  })
  perfil: string;

  @Prop({ 
    unique: true, 
    sparse: true, 
    minLength: 6, 
    maxlength: 6 
  }) // código pode ser único, mas não obrigatório
  codigo: number;

  @Prop({ default: null })
  dtCodigo: Date;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);

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
