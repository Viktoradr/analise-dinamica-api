import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CardKanban, CardKanbanDocument } from '../schemas/card.schema';

@Injectable()
export class CardKanbanService {

    constructor(
        @InjectModel(CardKanban.name) private CardModel: Model<CardKanbanDocument>
    ) { }

    
    async verifyTagInUse(tagId: Types.ObjectId, tenantId: Types.ObjectId): Promise<CardKanban[]> {
        return await this.CardModel.find({ 
            tenantId,
            tags: { $in: [tagId] } 
        });
    }

    // "cod_name": "LOC-000123",
    //ver como vai criar o gerar do cod_name

    
}