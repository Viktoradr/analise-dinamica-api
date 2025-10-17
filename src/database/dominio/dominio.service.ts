import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Dominio, DominioDocument } from './schemas/dominio.schema';

@Injectable()
export class DominioService {

    constructor(
        @InjectModel(Dominio.name) private model: Model<DominioDocument>
    ) { }
    
}