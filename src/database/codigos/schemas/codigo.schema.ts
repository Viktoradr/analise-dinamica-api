import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Codigo extends Document {
  
  @Prop({ 
    type: Types.ObjectId, 
    ref: 'Usuario', 
    required: true 
  })
  userId: Types.ObjectId;

  @Prop({ 
    required: true,
    minLength: 6, 
    maxlength: 6
  })
  codigo: number;

  @Prop()
  createdAt: Date;
}

export const CodigoSchema = SchemaFactory.createForClass(Codigo);

CodigoSchema.index(
  { codigo: 1 },
  {
    partialFilterExpression: { codigo: { $exists: true } },
  },
);