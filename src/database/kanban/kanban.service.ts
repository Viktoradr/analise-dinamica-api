import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Kanban, KanbanDocument } from './schemas/kanban.schema';
import { TemplateCardService } from './k-template/template-card.service';
import { MENSAGENS } from 'src/constants/mensagens';
import { KanbanRaia } from './schemas/kanban-raia.schema';

@Injectable()
export class KanbanService {

    constructor(
        @InjectModel(Kanban.name) private model: Model<KanbanDocument>
    ) { }
    
    
    async createInitalKanban(userId: Types.ObjectId, tenantId: Types.ObjectId, codigo: string, raias: KanbanRaia[]): Promise<void> {
        const created = new this.model({
            createdBy: userId,
            tenantId: tenantId,
            codigo,
            raias
        });
        created.save();
    }
    
    async findByTenantId(tenantId: Types.ObjectId): Promise<KanbanDocument> {
        const result = await this.model.findOne({ tenantId });
        if (!result) {
            throw new NotFoundException(MENSAGENS.KANBAN_NOTFOUND);
        }
        return result;
    }
}