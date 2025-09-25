import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RestricoesDocument = Restricoes & Document & { _id: Types.ObjectId };

@Schema({ collection: 'restricoes',  timestamps: true })
export class Restricoes extends Document {
  @Prop({ required: true })
  nome: string;

  @Prop({ required: true })
  descricao: string;
}

export const RestricoesSchema = SchemaFactory.createForClass(Restricoes);
