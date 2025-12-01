import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CardTemplate, CardTemplateDocument } from '../schemas/template-card.schema';
import { CreateTemplateCardDto } from './dto/template-card-create.dto';
import { MENSAGENS } from 'src/constants/mensagens';

@Injectable()
export class TemplateCardService {

    constructor(
        @InjectModel(CardTemplate.name) private model: Model<CardTemplateDocument>
    ) { }

    async findAll(): Promise<CardTemplate[]> {
        const result = await this.model
            .find({})
            .exec();

        return result;
    }
    
    async findById(id: Types.ObjectId): Promise<CardTemplateDocument> {
        const result = await this.model.findOne({ _id: id });
        if (!result) {
            throw new NotFoundException(MENSAGENS.TEMPLATE_CARD_NOTFOUND);
        }
        return result;
    }

    async verifyExist(tenantId: Types.ObjectId, name: string): Promise<boolean> {
        const result = await this.model.findOne({ tenantId, name });
        return !!result;
    }

    async create(userId: Types.ObjectId, tenantId: Types.ObjectId, body: CreateTemplateCardDto): Promise<CardTemplate> {

        if (await this.verifyExist(tenantId, body.name)) {
            throw new BadRequestException(`Card Template (${body.name}) já existe.`);
        }

        const created = new this.model({
            ...body,
            createdBy: userId,
            tenantId: tenantId
        });
        return created.save();
    }
}