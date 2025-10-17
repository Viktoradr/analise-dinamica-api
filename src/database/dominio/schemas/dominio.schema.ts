import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type DominioDocument = HydratedDocument<Dominio> & { _id: Types.ObjectId };

@Schema({ timestamps: true })
export class Dominio {
  @Prop({ 
    required: true, 
    lowercase: true,
    trim: true
  })
  id_dominio: string;

  @Prop({ 
    required: true, 
    lowercase: true,
    trim: true
  })
  nm_propriedade: string;

  @Prop({ 
    required: true, 
    lowercase: true,
    trim: true
  })
  nm_propriedade_dominio: string;

  @Prop({ 
    required: true, 
    lowercase: true,
    trim: true
  })
  cd_propriedade: string;

  @Prop({ type: Boolean, default: true })
  ativo: boolean;
}

export const DominioSchema = SchemaFactory.createForClass(Dominio);
