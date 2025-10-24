import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TipoCardDocument = HydratedDocument<TipoCard> & { _id: Types.ObjectId };

@Schema({ timestamps: true })
export class TipoCard {

    @Prop({ required: true, lowercase: true, trim: true })
    codCard: string;

    @Prop({ lowercase: true, trim: true })
    name: string;

    @Prop({ type: String, trim: true })
    description: string;
}

export const TipoCardSchema = SchemaFactory.createForClass(TipoCard);
