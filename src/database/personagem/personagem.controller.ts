import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PersonagemService } from './personagem.service';
import { MENSAGENS } from 'src/constants/mensagens';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatePersonagemDto } from './dto/personagem-create.dto';

@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@ApiTags('personagem')
@Controller('personagem')
export class PersonagemController {
    constructor(private service: PersonagemService) { }

    @Get()
    @ApiOperation({
        summary: 'Listar os personagens cadastrados',
        description: 'Endpoint responsável por retornar os personagens cadastrados. Requer autenticação e permissões específicas.'
    })

    async getPersonagens() {
        const result = await this.service.findAll();
        return result;
    }

    @Post()
    @ApiOperation({
        summary: 'Criar um personagem',
        description: 'Endpoint responsável por criar um novo personagem no sistema. Requer autenticação e permissões específicas.'
    })
    @ApiBody({ type: CreatePersonagemDto })
    @ApiResponse({ status: 201, description: MENSAGENS.PERSONAGEM_CREATED })
    async importCard(
        @Body() body: CreatePersonagemDto
    ) {
        const personagem = await this.service.create(body);
        return { personagem, message: MENSAGENS.PERSONAGEM_CREATED }
    }
}
