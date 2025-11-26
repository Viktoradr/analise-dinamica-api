import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { MENSAGENS } from 'src/constants/mensagens';
import { TenantId } from 'src/decorators/tenantid.decorator';
import { UserId } from 'src/decorators/userid.decorator';
import { TipoCardService } from '../k-tipo-card/tipoCard.service';
import { CreateTipoCardDto } from '../k-tipo-card/dto/tipo-card-create.dto';
import { TemplateCardService } from './template-card.service';
import { CreateTemplateCardDto } from './dto/template-card-create.dto';
import { ServiceGuard } from 'src/guards/service.guard';
import { JwtAuthGuard } from 'src/database/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@ApiTags('template')
@Controller('template')
export class TemplateController {
    constructor(
        private cardTemplateService: TemplateCardService,
        private tipoCardService: TipoCardService
    ) { }

    @Get('cards')
    @ApiOperation({
        summary: 'Listar os templates dos cards',
        description: 'Endpoint responsável por retornar os templates dos cards cadastrados. Requer autenticação e permissões específicas.'
    })
    async getCards() {
        const cards = await this.cardTemplateService.findAll();
        return cards;
    }

    @Post('card')
    @ApiOperation({
        summary: 'Criar um template de card',
        description: 'Endpoint responsável por criar um novo template de card no sistema. Requer autenticação e permissões específicas.'
    })
    @ApiBody({ type: CreateTemplateCardDto })
    @ApiResponse({ status: 201, description: MENSAGENS.TEMPLATE_CARD_CREATED })
    async importCard(
        @UserId() userId: Types.ObjectId,
        @TenantId() tenantId: Types.ObjectId,
        @Body() body: CreateTemplateCardDto
    ) {
        const card = await this.cardTemplateService.create(userId, tenantId, body);
        return { card, message: MENSAGENS.TEMPLATE_CARD_CREATED }
    }

    @Post('cards')
    @ApiOperation({
        summary: 'Criar novos templates de card',
        description: 'Endpoint responsável por criar novos templates de card no sistema. Requer autenticação e permissões específicas.'
    })
    @ApiBody({ type: [CreateTemplateCardDto] })
    @ApiResponse({ status: 201, description: MENSAGENS.TEMPLATE_CARD_CREATED })
    async importTiposCards(
        @UserId() userId: Types.ObjectId,
        @TenantId() tenantId: Types.ObjectId,
        @Body() body: CreateTemplateCardDto[]
    ) {
        const results = await Promise.all(
            body.map(item =>
                this.cardTemplateService.create(userId, tenantId, item)
            )
        );

        return {
            cards: results,
            message: MENSAGENS.TEMPLATE_CARD_CREATED,
            count: results.length
        };
    }

    @Get('tipos')
    @ApiOperation({
        summary: 'Listar os templates dos tipos',
        description: 'Endpoint responsável por retornar os templates dos tipos de card cadastrados. Requer autenticação e permissões específicas.'
    })
    async getTipos(
        @UserId() userId: Types.ObjectId
    ) {
        const tipos = await this.tipoCardService.findAll();
        return tipos;
    }

    @Post('tipoCard')
    @ApiOperation({
        summary: 'Criar tipo de card',
        description: 'Endpoint responsável por criar um novo tipo de card no sistema. Requer autenticação e permissões específicas.'
    })
    @ApiBody({ type: CreateTipoCardDto })
    @ApiResponse({ status: 201, description: MENSAGENS.TIPOCARD_CREATED })
    async importTipoCard(
        @UserId() userId: Types.ObjectId,
        @TenantId() tenantId: Types.ObjectId,
        @Body() body: CreateTipoCardDto
    ) {
        const tipoCard = await this.tipoCardService.create(userId, tenantId, body);
        return { tipoCard, message: MENSAGENS.TIPOCARD_CREATED }
    }

    @Post('tiposCard')
    @ApiOperation({
        summary: 'Criar novos tipos de card',
        description: 'Endpoint responsável por criar novos tipos de card no sistema. Requer autenticação e permissões específicas.'
    })
    @ApiBody({ type: [CreateTipoCardDto] })
    @ApiResponse({ status: 201, description: MENSAGENS.TIPOCARD_CREATED })
    async importTiposCard(
        @UserId() userId: Types.ObjectId,
        @TenantId() tenantId: Types.ObjectId,
        @Body() body: CreateTipoCardDto[]
    ) {
        const results = await Promise.all(
            body.map(item =>
                this.tipoCardService.create(userId, tenantId, item)
            )
        );

        return {
            tipoCards: results,
            message: MENSAGENS.TIPOCARD_CREATED,
            count: results.length
        };
    }
}
