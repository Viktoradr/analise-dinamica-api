import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CardKanbanService } from '../kanban/k-cards/cards.service';
import { Types } from 'mongoose';
import { CreateCardDto } from '../kanban/k-cards/dto/card-create.dto';
import { CreateCardConsumerDto } from './dto/create-card-consumer.dto';
import { MENSAGENS } from 'src/constants/mensagens';
import { UserId } from 'src/decorators/userid.decorator';
import { TemplateCardService } from '../kanban/k-template/template-card.service';
import { TipoCardService } from '../kanban/k-tipo-card/tipoCard.service';
import { TenantService } from '../tenant/tenant.service';
import { KanbanService } from '../kanban/kanban.service';

@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@ApiTags('consumer')
@Controller('consumer')
export class ConsumerController {
    constructor(
        private readonly cardKanbanService: CardKanbanService,
        private kanbanService: KanbanService,
        private templateCardService: TemplateCardService,
        private tipoCardService: TipoCardService,
        private tenantService: TenantService
    ) { }
}
