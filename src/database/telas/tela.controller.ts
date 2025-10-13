import { Controller, Post, Body, UseGuards, Put, Param, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TelaService } from './tela.service';
import { CreateTelaDto } from './dto/tela-create.dto';
import { UserId } from '../../decorators/userid.decorator';
import { Types } from 'mongoose';
import { MENSAGENS } from '../../constants/mensagens';
import { Roles } from '../../decorators/roles.decorator';
import { RoleEnum } from '../../enum/perfil.enum';
import { PerfilService } from '../perfil/perfil.service';
import { UserRoles } from '../../decorators/user-roles.decorator';

@ApiTags('tela')
@UseGuards(JwtAuthGuard)
@Controller('tela')
export class TenantController {
    constructor(
        private service: TelaService,
        private perfilService: PerfilService
    ) { }

    @Roles(RoleEnum.ADM)
    @Get()
    async findAll() {
        const telas = await this.service.findAll();

        return telas.map((tela: any) => ({
            id: tela._id,
            name: tela.name,
            description: tela.description,
            route: tela.route,
            icon: tela.icon
        }));
    }

    @Get('access')
    async access(@UserRoles() roles: RoleEnum[]) {
        const perfilTelas = await this.perfilService.getScreens(roles);
        const telas = await this.service.findAllByIds(perfilTelas);

        return telas.map((tela: any) => ({
            name: tela.name,
            description: tela.description,
            route: tela.route,
            icon: tela.icon
        }));
    }

    @Roles(RoleEnum.ADM)
    @Post()
    async create(
        @UserId() userId: Types.ObjectId,
        @Body() body: CreateTelaDto
    ) {
        const tela = await this.service.create(
            body.name,
            body.description,
            body.route,
            body.icon,
            userId
        );

        return {
            id: tela._id,
            name: tela.name,
            description: tela.description,
            route: tela.route,
            icon: tela.icon,
        }
    }

    @Roles(RoleEnum.ADM)
    @Put()
    async update(
        @UserId() userId: Types.ObjectId,
        @Body() body: CreateTelaDto,
        @Param() id: Types.ObjectId,
    ) {
        await this.service.update(
            id,
            body.name,
            body.description,
            body.route,
            body.icon,
            userId
        );

        return { message: MENSAGENS.SCREEN_UPDATED.replace("{nome}", body.name) }
    }
}
