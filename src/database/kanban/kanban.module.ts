import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { KanbanController } from './kanban.controller';
import { KanbanService } from './kanban.service';
import { Kanban, KanbanSchema } from './schemas/kanban.schema';
import { TagKanbanController } from './k-tags/tags.controller';
import { TagKanbanService } from './k-tags/tags.service';
import { CardKanbanController } from './k-cards/cards.controller';
import { CardKanbanService } from './k-cards/cards.service';
import { CardKanban, CardKanbanSchema } from './schemas/card.schema';
import { TagKanban, TagKanbanSchema } from './schemas/tags.schema';
import { Template, TemplateSchema } from './schemas/template.schema';
import { TipoCard, TipoCardSchema } from './schemas/tipo-card.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Kanban.name, schema: KanbanSchema }]),
        MongooseModule.forFeature([{ name: TagKanban.name, schema: TagKanbanSchema }]),
        MongooseModule.forFeature([{ name: CardKanban.name, schema: CardKanbanSchema }]),
        MongooseModule.forFeature([{ name: Template.name, schema: TemplateSchema }]),
        MongooseModule.forFeature([{ name: TipoCard.name, schema: TipoCardSchema }])
    ],
    controllers: [
        KanbanController,
        TagKanbanController,
        CardKanbanController
    ],
    providers: [
        KanbanService,
        TagKanbanService,
        CardKanbanService
    ],
    exports: [
        KanbanService,
        TagKanbanService,
        CardKanbanService
    ],
})
export class KanbanModule { }
