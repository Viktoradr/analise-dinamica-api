import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Tela } from './schemas/telas.schema';
import { MENSAGENS } from 'src/constants/mensagens';

@Injectable()
export class TelaService {

    constructor(
        @InjectModel(Tela.name) private model: Model<Tela>,
    ) { }

    async findAll() : Promise<Tela[]> {
        const result = await this.model
            .find()
            .exec()
        return result.map(doc => doc.toObject());
    }

    async findAllByIds(ids: Types.ObjectId[]) : Promise<Tela[]> {
        return await this.model.find({
            id: { $in: ids }
        });
    }

    async create(name: string, description: string, route: string[], icon: string, userIdCreated: Types.ObjectId) : Promise<Tela> {

        return await this.model.create({
            name, 
            description, 
            route, 
            icon, 
            userIdCreated
        });
    }
    
    async update(id: Types.ObjectId, name: string, description: string, route: string[], icon: string, userIdUpdated: Types.ObjectId): Promise<void> {
        const tela = await this.model.findById(id);

        if(!tela) {
            throw new BadRequestException(MENSAGENS.SCREEN_INVALID);
        }

        tela.name = name;
        tela.description = description;
        tela.route = route;
        tela.icon = icon;
        tela.userIdUpdated = userIdUpdated;

        await tela.save();
    }
}