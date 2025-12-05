import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CardKanbanService } from './cards.service';
import { JwtAuthGuard } from 'src/database/auth/guards/jwt-auth.guard';
import { Types } from 'mongoose';
import { TenantId } from 'src/decorators/tenantid.decorator';
import { MENSAGENS } from 'src/constants/mensagens';
import { UserId } from 'src/decorators/userid.decorator';
import { CreateCardDto } from './dto/card-create.dto';
import { TipoCardService } from '../k-tipo-card/tipoCard.service';
import { TemplateCardService } from '../k-template/template-card.service';
import { TenantService } from 'src/database/tenant/tenant.service';
import { KanbanService } from '../kanban.service';
import { UpdateCardCheckDto } from './dto/card-check-update.dto';
import { TagKanbanService } from '../k-tags/tags.service';
import { CardResponse } from './dto/card-response.dto';
import { UpdateCardDto } from './dto/card-update.dto';

@ApiTags('cards')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('cards')
export class CardKanbanController {
    constructor(
        private readonly service: CardKanbanService,
        private readonly tipoCardService: TipoCardService,
        private readonly templateCardService: TemplateCardService,
        private readonly tenantService: TenantService,
        private readonly kanbanService: KanbanService,
        private readonly tagKanbanService: TagKanbanService
    ) { }

    @Get('comboTipoCard')
    @ApiOperation({
        summary: 'Listar a combo tipo de card',
        description: 'Endpoint responsável por retornar a combo tipo de card cadastrados. Requer autenticação e permissões específicas.'
    })
    async comboTipoCard(
        @TenantId() tenantId: Types.ObjectId
    ) {
        return await this.service.getTipoCardInUse(tenantId);
    }

    @Get()
    @ApiOperation({
        summary: 'Listar os cards para consumo',
        description: 'Endpoint responsável por listar os cards.'
    })
    @ApiQuery({
        name: 'order',
        required: false,
        type: Number,
        minimum: 1,
        description: 'Número de ordem da raia',
    })
    @ApiQuery({
        name: 'tenantId',
        required: false,
        type: String,
        format: 'ObjectId',
        description: 'Id de um tenant',
    })
    async listar(
        @Query() query: {
            order?: number,
            tenantId?: string
        }
    ) {
        return await this.service.findAllToConsumer(query);
    }

    @Get('consumer/:id')
    @ApiOperation({
        summary: 'Listar um card para consumo',
        description: 'Endpoint responsável por retornar a informação do card'
    })
    @ApiParam({
        name: 'id',
        type: String,
        format: 'ObjectId',
    })
    async get(
        @Param('id') cardKanbanId: Types.ObjectId,
    ) {
        return await this.service.findPopulateByIdActive(cardKanbanId);
    }

    @Post()
    @ApiOperation({
        summary: 'Criar card kanban para o tenant',
        description: 'Endpoint responsável por criar o card do kanban do tenant. Requer autenticação e permissões específicas.'
    })
    async create(
        @UserId() userId: Types.ObjectId,
        @TenantId() tenantId: Types.ObjectId,
        @Body() body: CreateCardDto
    ) {
        const kanban = await this.kanbanService.findByTenantId(tenantId);
        const cardTemplate = await this.templateCardService.findById(new Types.ObjectId(body.cardTemplateId));
        const tipoCard = await this.tipoCardService.findById(new Types.ObjectId(cardTemplate.tipoCardId));
        const tenant = await this.tenantService.findById(tenantId);

        const card = await this.service.create(userId, tenant, kanban, tipoCard, cardTemplate, body);

        //criar log de auditoria
        
        return { card, message: MENSAGENS.CARD_KANBAN_CREATED }
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Retorna o card pelo id para o sistema',
        description: 'Endpoint responsável por retornar o card para utilização dentro do sistema'
    })
    @ApiParam({
        name: 'id',
        type: String,
        format: 'ObjectId',
        example: '507f1f77bcf86cd799439011'
    })
    async getCard(
        @Param('id') cardKanbanId: Types.ObjectId,
        @TenantId() tenantId: Types.ObjectId
    ) {
        const card = await this.service.findPopulateByIdActive(cardKanbanId, tenantId);
        return CardResponse(card);
    }

    @Post('checkChecklistItem')
    @ApiOperation({
        summary: 'Dar check ao um dos itens do checklist',
        description: 'Endpoint responsável por dar check ao um dos itens do checklist. Requer autenticação e permissões específicas.'
    })
    async checkChecklistItem(
        @UserId() userId: Types.ObjectId,
        @TenantId() tenantId: Types.ObjectId,
        @Body() body: UpdateCardCheckDto
    ) {
        await this.service.checkedChecklist(
            userId, 
            tenantId,
            new Types.ObjectId(body.cardKanbanId), 
            new Types.ObjectId(body.checklistItemId),
            body.check
        );

        return { message: MENSAGENS.CARD_KANBAN_UPDATED }
    }

    @Post('checkWorkflowItem')
    @ApiOperation({
        summary: 'Dar check ao um dos itens do workflow',
        description: 'Endpoint responsável por dar check ao um dos itens do workflow. Requer autenticação e permissões específicas.'
    })
    async checkWorkflowItem(
        @UserId() userId: Types.ObjectId,
        @TenantId() tenantId: Types.ObjectId,
        @Body() body: UpdateCardCheckDto
    ) {
        await this.service.checkedWorkflow(
            userId, 
            tenantId,
            new Types.ObjectId(body.cardKanbanId), 
            new Types.ObjectId(body.checklistItemId),
            body.check
        );

        return { message: MENSAGENS.CARD_KANBAN_UPDATED }
    }

    @Put(':id/mudarRaia')
    @ApiOperation({
        summary: 'Dar check ao um dos itens do workflow',
        description: 'Endpoint responsável por dar check ao um dos itens do workflow. Requer autenticação e permissões específicas.'
    })
    @ApiParam({
        name: 'id',
        type: String,
        format: 'ObjectId',
        example: '507f1f77bcf86cd799439011'
    })
    async mudarRaia(
        @Param('id') cardKanbanId: Types.ObjectId,
        @UserId() userId: Types.ObjectId,
        @TenantId() tenantId: Types.ObjectId
    ) {
        const card = await this.service.findByIdActive(cardKanbanId, tenantId);
        const kanban = await this.kanbanService.findByTenantId(tenantId);
        const cardTemplate = await this.templateCardService.findById(card.cardTemplate.templateCardId);

        await this.service.mudarRaia(
            userId,
            card,
            cardTemplate,
            kanban
        );

        return { message: MENSAGENS.CARD_KANBAN_UPDATED }
    }

    @Put(':id/addTag')
    @ApiOperation({
        summary: 'Adiciona tag ao card',
        description: 'Endpoint responsável por adicionar a tag ao card.'
    })
    @ApiParam({
        name: 'id',
        type: String,
        format: 'ObjectId',
        example: '507f1f77bcf86cd799439011'
    })
    async addTag(
        @Param('id') cardKanbanId: Types.ObjectId,
        @UserId() userId: Types.ObjectId,
        @TenantId() tenantId: Types.ObjectId,
        @Body() body: { tagId: Types.ObjectId }
    ) {
        const tag = await this.tagKanbanService.findById(body.tagId, tenantId);
        await this.service.addTag(cardKanbanId, tenantId, userId, tag.name, body.tagId);

        return { message: MENSAGENS.CARD_KANBAN_UPDATED }
    }

    @Put(':id/removerTag')
    @ApiOperation({
        summary: 'Remover tag do card',
        description: 'Endpoint responsável por remover a tag do card.'
    })
    @ApiParam({
        name: 'id',
        type: String,
        format: 'ObjectId',
        example: '507f1f77bcf86cd799439011'
    })
    async removerTag(
        @Param('id') cardKanbanId: Types.ObjectId,
        @UserId() userId: Types.ObjectId,
        @TenantId() tenantId: Types.ObjectId,
        @Body() body: { tagId: Types.ObjectId }
    ) {
        const tag = await this.tagKanbanService.findById(body.tagId, tenantId);
        await this.service.removerTag(cardKanbanId, tenantId, userId, tag.name, body.tagId);

        return { message: MENSAGENS.CARD_KANBAN_UPDATED }
    }

    @Put(':id/campos')
    @ApiOperation({
        summary: 'Atualizar campos de um card para consumo',
        description: 'Endpoint responsável por atualizar os parametro de campos do card'
    })
    @ApiParam({
        name: 'id',
        type: String,
        format: 'ObjectId'
    })
    async atualizarCampos(
        @Param('id') cardKanbanId: Types.ObjectId,
        @Body() body: UpdateCardDto,
        @UserId() userId: Types.ObjectId,
        @TenantId() tenantId: Types.ObjectId,
    ) {
        const cards = await this.service.atualizarCampos(cardKanbanId, userId, tenantId, body.campos, body.camposPersonagem);
        return cards;
    }
}
