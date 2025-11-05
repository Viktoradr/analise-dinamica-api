import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Kanban, KanbanDocument } from './schemas/kanban.schema';
import { TemplateCardService } from './k-template/template-card.service';

@Injectable()
export class KanbanService {

    constructor(
        @InjectModel(Kanban.name) private model: Model<KanbanDocument>,
        private templateService: TemplateCardService,
    ) { }
    
    
    async createInitalKanban(userId: Types.ObjectId, tenantId: Types.ObjectId): Promise<void> {

      
        const created = new this.model({
            createdBy: userId,
            tenantId: tenantId
        });
        created.save();
    }
}