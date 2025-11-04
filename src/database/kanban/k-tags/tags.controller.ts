import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TagKanbanService } from './tags.service';
import { UserId } from '../../../decorators/userid.decorator';
import { TenantId } from '../../../decorators/tenantid.decorator';
import { Types } from 'mongoose';
import { CardKanbanService } from '../k-cards/cards.service';
import { CreateTagDto } from './dto/tag-create.dto';
import { MENSAGENS } from 'src/constants/mensagens';
import { JwtAuthGuard } from 'src/database/auth/guards/jwt-auth.guard';

@ApiTags('tags')
@UseGuards(JwtAuthGuard)
@Controller('tags')
export class TagKanbanController {
    constructor(
        private service: TagKanbanService,
        private cardService: CardKanbanService) { }

    @Get()
    async findAll(
        @TenantId() tenantId: Types.ObjectId
    ) {
        const tags = await this.service.findAll(tenantId)

        return tags.map((u: any) => ({
            id: u._id,
            name: u.name,
            description: u.description,
            colorHex: u.colorHex,
            priority: u.priority,
            active: u.active,
            createdAt: u.createdAt
        }));
    }

    @Get('active')
    async findAllActive(
        @TenantId() tenantId: Types.ObjectId
    ) {
        const tags = await this.service.findAllActive(tenantId)

        return tags.map((u: any) => ({
            id: u._id,
            name: u.name,
            description: u.description,
            colorHex: u.colorHex,
            priority: u.priority
        }));
    }

    @Post()
    async create(
        @UserId() userId: Types.ObjectId,
        @TenantId() tenantId: Types.ObjectId,
        @Body() body: CreateTagDto
    ) {
        const tag = await this.service.create(userId, tenantId, body);
        return { tag, message: MENSAGENS.TAG_CREATED }
    }

    @Put(':id')
    async update(
        @Param('id') id: Types.ObjectId,
        @UserId() userId: Types.ObjectId,
        @TenantId() tenantId: Types.ObjectId,
        @Body() body: { name: string; description?: string; priority?: string; colorHex: string; active?: boolean }
    ) {
        await this.service.update(id, userId, tenantId, body);
        return { message: MENSAGENS.TAG_UPDATED };
    }

    @Delete(':id')
    async delete(
        @Param('id') id: Types.ObjectId,
        @UserId() userId: Types.ObjectId,
        @TenantId() tenantId: Types.ObjectId
    ) {
        const cards = await this.cardService.verifyTagInUse(id, tenantId);

        if (cards && cards.length > 0) {
            await this.service.update(id, userId, tenantId, { active: false });
            return { message: MENSAGENS.TAG_DEACTIVE };
        }

        this.service.delete(id, tenantId);

        return { message: MENSAGENS.TAG_DELETED };
    }
}
