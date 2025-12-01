import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Personagem, PersonagemDocument } from './schemas/personagem.schema';
import { CreatePersonagemDto } from './dto/personagem-create.dto';

@Injectable()
export class PersonagemService {

    constructor(@InjectModel('Personagem') private model: Model<PersonagemDocument>) { }

    async findAll(): Promise<Personagem[]> {
        const result = await this.model
            .find({})
            .exec();

        return result;
    }

    async create(body: CreatePersonagemDto): Promise<PersonagemDocument> {
        const user = await this.model.create({...body});
        return user.save();
    }
}
