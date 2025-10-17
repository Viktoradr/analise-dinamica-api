import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TagKanbanService } from './tags.service';
import { UserId } from '../../../decorators/userid.decorator';
import { TenantId } from '../../../decorators/tenantid.decorator';
import { Types } from 'mongoose';
import { CardKanbanService } from '../k-cards/cards.service';

@ApiTags('tags')
@Controller('tags')
export class TagKanbanController {
    constructor(
        private service: TagKanbanService,
        private cardService: CardKanbanService) { }

    @Get()
    async findAll(
        @TenantId() tenantId: Types.ObjectId
    ) {
        return await this.service.findAll(tenantId);
    }

    @Post()
    async create(
        @UserId() userId: Types.ObjectId,
        @TenantId() tenantId: Types.ObjectId,
        @Body() body: any
    ) {
        return await this.service.create(userId, tenantId, body);
    }

    @Put(':id')
    async update(
        @Param('id') id: Types.ObjectId,
        @UserId() userId: Types.ObjectId,
        @TenantId() tenantId: Types.ObjectId,
        @Body() body: { name: string; codName: string; description?: string; priority?: string; colorHex: string; active?: boolean }
    ) {
        return await this.service.update(id, userId, tenantId, body);
    }

    @Delete(':id')
    async delete(
        @Param('id') id: Types.ObjectId,
        @UserId() userId: Types.ObjectId,
        @TenantId() tenantId: Types.ObjectId
    ) {
        const cards = await this.cardService.verifyTagInUse(id, tenantId);

        if (cards && cards.length > 0) {
            return await this.service.update(id, userId, tenantId, { active: false });
        }

        return this.service.delete(id, tenantId);
    }
}
