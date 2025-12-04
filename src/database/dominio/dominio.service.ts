import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Dominio, DominioDocument } from './schemas/dominio.schema';
import { CreateDominioDto } from './dto/create-dominio.dto';

@Injectable()
export class DominioService {

    constructor(
        @InjectModel(Dominio.name) private model: Model<DominioDocument>
    ) { }
    
    async listarNomesDominios(): Promise<{ nm_propriedade: string }> {
        return await this.model
            .find({ ativo: true })
            .projection({ nm_propriedade: 1 })
            .lean()
    }
    
    async getAtributosPorDominio(propriedade: string): Promise<DominioDocument[]> {
        return await this.model
            .find({ nm_propriedade: propriedade, ativo: true })
            .exec()
    }

    async create(userId: Types.ObjectId, body: CreateDominioDto): Promise<DominioDocument> {
        const card = await this.model.create({
            ...body,
            userId: userId
        });
        return card.save();
    }
}