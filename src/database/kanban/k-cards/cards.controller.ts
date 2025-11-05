import { Body, Controller, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CardKanbanService } from './cards.service';
import { JwtAuthGuard } from 'src/database/auth/guards/jwt-auth.guard';

@ApiTags('cards')
@UseGuards(JwtAuthGuard)
@Controller('cards')
export class CardKanbanController {
    constructor(private service: CardKanbanService) { }

    // @Post()
    // async create(
    //     @UserId() userId: Types.ObjectId,
    //     @TenantId() tenantId: Types.ObjectId,
    //     @Body() body: CreateCardDto
    // ) {
    //     const tag = await this.service.create(userId, tenantId, body);
    //     return { tag, message: MENSAGENS.TAG_CREATED }
    // }

}
