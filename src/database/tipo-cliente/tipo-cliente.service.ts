import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TipoCliente, TipoClienteDocument } from './schemas/tipo-cliente.schema';

@Injectable()
export class TipoClienteService {

    constructor(@InjectModel(TipoCliente.name) private model: Model<TipoClienteDocument>) { }

    async findAll(): Promise<TipoCliente[]> {
        return this.model.find().lean({ virtuals: true });
    }
}
