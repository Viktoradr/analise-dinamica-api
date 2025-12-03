import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CardKanbanService } from '../kanban/k-cards/cards.service';
import { Types } from 'mongoose';

@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@ApiTags('consumer')
@Controller('consumer')
export class ConsumerController {
    constructor(
        private readonly cardKanbanService: CardKanbanService
    ) { }

    @Get('cards')
    @ApiOperation({
        summary: 'Listar os cards para consumo',
        description: 'Endpoint responsável por listar os cards.'
    })
    @ApiQuery({
        name: 'order',
        required: false,
        type: Number,
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
        const cards = await this.cardKanbanService.findAllToConsumer(query);
        return cards;
    }

    @Get('card/:id')
    @ApiOperation({
        summary: 'Listar os cards para consumo',
        description: 'Endpoint responsável por listar os cards.'
    })
    @ApiParam({
        name: 'id',
        type: String,
        format: 'ObjectId',
    })
    async get(
        @Param('id') cardKanbanId: Types.ObjectId,
    ) {
        const cards = await this.cardKanbanService.findPopulateByIdActive(cardKanbanId);
        return cards;
    }
}
