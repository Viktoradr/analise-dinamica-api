import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { TipoCard, TipoCardDocument } from '../schemas/tipo-card.schema';
import { CreateTipoCardDto } from './dto/tipo-card-create.dto';
import { MENSAGENS } from 'src/constants/mensagens';

@Injectable()
export class TipoCardService {

    constructor(
        @InjectModel(TipoCard.name) private model: Model<TipoCardDocument>
    ) { }
    
    async findAll(): Promise<TipoCardDocument[]> {
        const result = await this.model
            .find({})
            .exec();

        return result;
    }

    async findById(id: Types.ObjectId): Promise<TipoCardDocument> {
        const result = await this.model.findOne({ _id: id });
        if (!result) {
            throw new NotFoundException(MENSAGENS.TIPOCARD_NOTFOUND);
        }
        return result;
    }

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