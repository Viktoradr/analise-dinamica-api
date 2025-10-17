import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Kanban, KanbanDocument } from './schemas/kanban.schema';

@Injectable()
export class KanbanService {

    constructor(
        @InjectModel(Kanban.name) private model: Model<KanbanDocument>,
    ) { }
    
}