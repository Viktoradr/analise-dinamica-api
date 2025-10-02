import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { DocumentoEnum } from 'src/enum/documento.enum';

export type ArquivoDocument = Arquivo & Document & { _id: Types.ObjectId };

@Schema({ timestamps: true })
export class Arquivo extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop()
  tenantId: string;

  @Prop()
  awsUrl: string;

  @Prop({ 
    required: true,
    type: String,
    enum: DocumentoEnum, 
  })
  typeDoc: string;

  @Prop({ required: true })
  fileHash: string;

  @Prop({ required: true })
  fileName: string;

  @Prop({ required: true })
  fileSize: number;

  @Prop({ required: true })
  fileMimetype: string;

  @Prop({ required: true })
  filePageCount: number;
}

export const ArquivoSchema = SchemaFactory.createForClass(Arquivo);