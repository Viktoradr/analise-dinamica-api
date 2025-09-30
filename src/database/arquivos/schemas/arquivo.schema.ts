import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ArquivoDocument = Arquivo & Document & { _id: Types.ObjectId };

@Schema({ timestamps: true })
export class Arquivo extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop()
  tenantId: string;

  @Prop({ required: true })
  awsId: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  fileHash: string;

  @Prop({ required: true })
  fileName: string;

  @Prop({ required: true })
  fileSize: number;

  @Prop({ required: true })
  fileMimetype: string;
}

export const ArquivoSchema = SchemaFactory.createForClass(Arquivo);