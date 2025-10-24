import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { DocumentoEnum } from 'src/enum/documento.enum';

export type ArquivoDocument = Arquivo & Document & { _id: Types.ObjectId };

@Schema({ timestamps: true })
export class Arquivo extends Document {  
  @Prop({ type: Types.ObjectId, ref: 'Usuario', required: false, default: null })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true })
  tenantId: Types.ObjectId;

  @Prop({ type: String })
  awsKey: string;

  @Prop({ type: String })
  link: string;

  @Prop({ type: String })
  ocrId: string;

  @Prop({ type: Boolean, default: false })
  ocrOk: boolean;

  // @Prop({ type: Boolean, default: false })
  // embeddingsOk: boolean;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ 
    required: true,
    type: String,
    enum: DocumentoEnum, //mudar para collection
  })
  typeDoc: string;

  @Prop({ required: true })
  fileHash: string;

  @Prop({ required: true })
  fileName: string;

  @Prop({ required: true })
  fileSize: number;

  @Prop({ required: true })
  filetype: string;

  @Prop({ required: true })
  fileMimetype: string;

  @Prop({ required: true })
  filePageCount: number;

  @Prop({ type: Object })
  sectionMetadata: object;

  @Prop({ type: String })
  resumo: string;

  @Prop({ type: Boolean, default: true })
  active: boolean;
}

export const ArquivoSchema = SchemaFactory.createForClass(Arquivo);