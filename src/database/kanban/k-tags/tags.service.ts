import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { TagKanban, TagKanbanDocument } from '../schemas/tags.schema';

@Injectable()
export class TagKanbanService {

    constructor(
        @InjectModel(TagKanban.name) private model: Model<TagKanbanDocument>
    ) { }

    findAll(tenantId: Types.ObjectId) {
        return this.model.find({ tenantId }).exec();
    }
    
    async create(userId: Types.ObjectId, tenantId: Types.ObjectId, body: any): Promise<TagKanban> {

        if (await this.verifyExist(tenantId, body.codName)) {
            throw new BadRequestException('Tag já existe.');
        }

        const createdTag = new this.model({
            ...body,
            createdBy: userId,
            tenantId: tenantId
        });
        return createdTag.save();
    }

    async verifyExist(tenantId: Types.ObjectId, codName: string): Promise<boolean> {
        const result = await this.model.findOne({ tenantId, cd_tag: codName });
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

    async delete(id: Types.ObjectId, tenantId: Types.ObjectId): Promise<TagKanban | null> {
        return this.model.findByIdAndDelete(id);
    }
}