import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { PerfilEnum } from 'src/shared/enum/perfil.enum';

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
    enum: [PerfilEnum.ADMIN, PerfilEnum.USER, PerfilEnum.BACKOFFICE], // restringe perfis permitidos
    default: PerfilEnum.USER,
  })
  perfil: string;

  @Prop({ 
    type: Number,
    default: null,
    minLength: 6, 
    maxlength: 6 
  }) // código pode ser único, mas não obrigatório
  codigo?: number;

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

// Validação customizada de 6 dígitos (opcional, mas recomendado)
UsuarioSchema.path('codigo').validate((value: number) => {
  if (value === null || value === undefined) return true; // permite nulo
  return value >= 100000 && value <= 999999; // apenas números de 6 dígitos
}, 'O código deve ter exatamente 6 dígitos');
