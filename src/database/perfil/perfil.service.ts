import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Perfil, PerfilDocument } from './schemas/perfil.schema';

@Injectable()
export class PerfilService {

    constructor(@InjectModel(Perfil.name) private model: Model<PerfilDocument>) { }

    async findAll(): Promise<Perfil[]> {
        return this.model.find().lean({ virtuals: true });
    }
}
