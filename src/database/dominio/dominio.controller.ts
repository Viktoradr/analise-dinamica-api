import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DominioService } from './dominio.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateDominioDto } from './dto/create-dominio.dto';
import { UserId } from 'src/decorators/userid.decorator';
import { Types } from 'mongoose';

@ApiTags('dominio')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('dominio')
export class DominioController {
    constructor(private service: DominioService) { }

    @Get()
    @ApiOperation({
        summary: 'Listar os dominios',
        description: 'Endpoint responsável por listar os nomes dos domínios.'
    })
    async dominios() {
        return await this.service.listarNomesDominios()
    }

    @Get(':propriedade')                                                                            
    @ApiOperation({
        summary: 'Listar os atributos do domínio',
        description: 'Endpoint responsável por listar os atributos dos domínios.'
    })
    async atributos(
        @Param() propriedade: string
    ) {
        return await this.service.getAtributosPorDominio(propriedade)
    }

    @Post()
    @ApiOperation({
        summary: 'Criar um domínio',
        description: 'Endpoint responsável por cadastrar um dominio'
    })
    async create(
        @UserId() userId: Types.ObjectId,
        @Body() body: CreateDominioDto
    ) {
        return await this.service.create(userId, body)
    }
}
