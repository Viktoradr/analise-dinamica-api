import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Tela extends Document {

  @Prop({ Type: String, required: true })
  name: string; 

  @Prop({ Type: String, required: true })
  description: string; 

  @Prop({ Type: [String], lowercase: true, required: true })
  route: string[]; 

  @Prop({ Type: String, lowercase: true, required: true })
  icon: string; 

  @Prop({ type: Types.ObjectId, ref: 'Usuario', required: true })
  userIdCreated: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Usuario', default: null })
  userIdUpdated: Types.ObjectId;
}

export const TelaSchema = SchemaFactory.createForClass(Tela);