import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Lead, LeadDocument } from './schemas/leads.schema';

@Injectable()
export class LeadService {

    constructor(@InjectModel(Lead.name) private model: Model<LeadDocument>) { }

    async findAll(): Promise<Lead[]> {
        return this.model.find().lean({ virtuals: true });
    }

    async create(data: Partial<Lead>): Promise<Lead> {
        const created = await this.model.create(data);
        return created.toJSON();
    }

}
