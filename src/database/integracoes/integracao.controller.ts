import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MENSAGENS } from 'src/constants/mensagens';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateIntegracaoDto } from './dto/integracao-create.dto';
import { IntegracaoService } from './integracao.service';
import { Types } from 'mongoose';
import { TenantId } from 'src/decorators/tenantid.decorator';
import { UserId } from 'src/decorators/userid.decorator';

@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@ApiTags('integracao')
@Controller('integracao')
export class IntegracaoController {
    constructor(private service: IntegracaoService) { }

    @Get()
    @ApiOperation({
        summary: 'Listar os integrações cadastrados',
        description: 'Endpoint responsável por retornar os integrações cadastrados. Requer autenticação e permissões específicas.'
    })
    async getIntegracoes() {
        const result = await this.service.findAll();
        return result;
    }

    @Post()
    @ApiOperation({
        summary: 'Criar um Integração',
        description: 'Endpoint responsável por criar um novo Integração no sistema. Requer autenticação e permissões específicas.'
    })
    @ApiBody({ type: CreateIntegracaoDto })
    @ApiResponse({ status: 201, description: MENSAGENS.INTEGRACAO_CREATED })
    async importCard(
        @UserId() userId: Types.ObjectId,
        @TenantId() tenantId: Types.ObjectId,
        @Body() body: CreateIntegracaoDto
    ) {
        const integracao = await this.service.create(userId, tenantId, body);
        return { integracao, message: MENSAGENS.INTEGRACAO_CREATED }
    }
}
