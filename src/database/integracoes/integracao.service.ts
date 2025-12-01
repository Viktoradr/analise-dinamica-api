import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { IntegracaoDocument, Integracao } from './schemas/integracao.schema';
import { CreateIntegracaoDto } from './dto/integracao-create.dto';

@Injectable()
export class IntegracaoService {

    constructor(@InjectModel('Integracao') private model: Model<IntegracaoDocument>) { }

    async findAll(): Promise<Integracao[]> {
        const result = await this.model
            .find({})
            .exec();

        return result;
    }

    async create(userId: Types.ObjectId, tenantId: Types.ObjectId, body: CreateIntegracaoDto): Promise<IntegracaoDocument> {
        const user = await this.model.create({
            ...body,
            tenantId: tenantId,
            createdBy: userId
        });
        return user.save();
    }

    async getIntegracaoByTenant(tenantId: Types.ObjectId, name?: string) : Promise<Integracao[]> {
        
        const filter: any = { tenantId };

        if (name?.trim()) filter.nome = { $regex: name.trim(), $options: 'i' };

        const result = await this.model
            .find(filter)
            .exec();

        return result;
    }
}
