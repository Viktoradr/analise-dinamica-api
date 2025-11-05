import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { TagKanban, TagKanbanDocument } from '../schemas/tags.schema';
import { CreateTagDto } from './dto/tag-create.dto';
import { TAG_DEFAULT } from './tags_default';

@Injectable()
export class TagKanbanService {

    constructor(
        @InjectModel(TagKanban.name) private model: Model<TagKanbanDocument>
    ) { }

    findAllActive(tenantId: Types.ObjectId): Promise<TagKanban[]> {
        return this.model.find({ tenantId, active: true }).exec();
    }

    findAll(tenantId: Types.ObjectId): Promise<TagKanban[]> {
        return this.model.find({ tenantId }).exec();
    }
    
    async create(userId: Types.ObjectId, tenantId: Types.ObjectId, body: CreateTagDto): Promise<TagKanban> {

        if (await this.verifyExist(tenantId, body.name)) {
            throw new BadRequestException('Tag já existe.');
        }

        const created = new this.model({
            ...body,
            createdBy: userId,
            tenantId: tenantId
        });
        return created.save();
    }
    
    async createInitalTag(userId: Types.ObjectId, tenantId: Types.ObjectId): Promise<void> {

        const tagsToInsert = TAG_DEFAULT.map(tag => ({
            name: tag.name,
            description: tag.description,
            priority: tag.priority,
            colorHex: tag.colorHex,
            active: true,
            createdBy: userId,
            tenantId: tenantId,
            createdAt: new Date(),
            updatedAt: new Date()
        }));
        
        await this.model.insertMany(tagsToInsert);
    }

    async verifyExist(tenantId: Types.ObjectId, name: string): Promise<boolean> {
        const result = await this.model.findOne({ tenantId, name });
        return !!result;
    }

    async update(
        id: Types.ObjectId, 
        userId: Types.ObjectId, 
        tenantId: Types.ObjectId, 
        body: any
    ): Promise<TagKanban | null> {
        const tag = await this.model.findOne({ _id: id, tenantId });

        if (!tag) {
            throw new BadRequestException('Tag não encontrada.');
        }

        //verificar se a data de atualização esta mudando
        tag.set({ ...body, updatedBy: userId });

        return tag.save();
    }

    async delete(id: Types.ObjectId, tenantId: Types.ObjectId) {
        return await this.model.deleteOne({ _id: id, tenantId });
    }
}