import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { TipoCard, TipoCardDocument } from '../schemas/tipo-card.schema';
import { CreateTipoCardDto } from './dto/tipo-card-create.dto';

@Injectable()
export class TipoCardService {

    constructor(
        @InjectModel(TipoCard.name) private model: Model<TipoCardDocument>
    ) { }

    async verifyExist(tenantId: Types.ObjectId, name: string): Promise<boolean> {
        const result = await this.model.findOne({ tenantId, name });
        return !!result;
    }

    async create(userId: Types.ObjectId, tenantId: Types.ObjectId, body: CreateTipoCardDto): Promise<TipoCard> {

        if (await this.verifyExist(tenantId, body.name)) {
            throw new BadRequestException(`Tipo Card (${body.name}) já existe.`);
        }

        const created = new this.model({
            ...body,
            createdBy: userId,
            tenantId: tenantId
        });
        return created.save();
    }
}