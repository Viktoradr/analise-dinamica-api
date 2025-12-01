import { forwardRef, Module } from '@nestjs/common';
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
import { TipoCard, TipoCardSchema } from './schemas/tipo-card.schema';
import { CardTemplate, CardTemplateSchema } from './schemas/template-card.schema';
import { TemplateController } from './k-template/template.controller';
import { TipoCardService } from './k-tipo-card/tipoCard.service';
import { TemplateCardService } from './k-template/template-card.service';
import { JwtService } from '@nestjs/jwt';
import { TenantModule } from '../tenant/tenant.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Kanban.name, schema: KanbanSchema }]),
        MongooseModule.forFeature([{ name: TagKanban.name, schema: TagKanbanSchema }]),
        MongooseModule.forFeature([{ name: CardKanban.name, schema: CardKanbanSchema }]),
        MongooseModule.forFeature([{ name: CardTemplate.name, schema: CardTemplateSchema }]),
        MongooseModule.forFeature([{ name: TipoCard.name, schema: TipoCardSchema }]),
        forwardRef(() => TenantModule),
    ],
    controllers: [
        KanbanController,
        TagKanbanController,
        CardKanbanController,
        TemplateController
    ],
    providers: [
        JwtService,
        KanbanService,
        TagKanbanService,
        CardKanbanService,
        TagKanbanService,
        TipoCardService,
        TemplateCardService
    ],
    exports: [
        KanbanService,
        TagKanbanService,
        CardKanbanService,
        TagKanbanService,
        TipoCardService,
        TemplateCardService
    ],
})
export class KanbanModule { }
