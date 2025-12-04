import { Controller, Get, Post, Body, UseGuards, Req, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LogsService } from '../auditoria/logs.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantService } from './tenant.service';
import { RoleEnum } from 'src/enum/perfil.enum';
import { Roles } from 'src/decorators/roles.decorator';
import { ServiceGuard } from 'src/guards/service.guard';
import { CreateTentantDto } from './dto/tenant.dto';
import { TagKanbanService } from '../kanban/k-tags/tags.service';
import { UsuarioService } from '../usuario/usuario.service';
import { Types } from 'mongoose';
import { LogsObrigatorioEnum } from 'src/enum/logs-obrigatorio.enum';
import { EventEnum } from 'src/enum/event.enum';
import { MENSAGENS } from 'src/constants/mensagens';
import { ClassMethodName } from 'src/decorators/method-logger.decorator';

@ApiTags('tenant')
@Controller('tenant')
@ApiBearerAuth('JWT-auth')
@Roles(RoleEnum.ADM_TOTAL)
export class TenantController {
  constructor(
    private service: TenantService,
    private tagService: TagKanbanService,
    private userService: UsuarioService,
    private logService: LogsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Query() params: {
    name?: string;
    email?: string;
    dtInicio?: Date | string;
    dtFim?: Date | string;
  }
  ) {
    return await this.service.findAll(params)
  }

  @Post()
  @UseGuards(ServiceGuard)
  @ApiOperation({
    summary: 'Criar um tenant',
    description: 'Endpoint responsável por criar dados do tenant. Requer autenticação e permissões específicas.'
  })
  @ApiBody({ type: CreateTentantDto })
  async create(
    @Req() req: Request,
    @ClassMethodName() fullName: string,
    @Body() body: CreateTentantDto
  ) {
    const tenant = await this.service.create(body);

    await this.logService.createLog({
      event: EventEnum.INFO,
      type: LogsObrigatorioEnum.TENANT_CREATED,
      tenantId: tenant.id,
      action: `${req.method} ${req.url}`,
      method: fullName,
      message: MENSAGENS.ACCESS_SUCCESS,
      details: {}
    })

    const user = await this.userService.create({
      nome: tenant.name,
      email: tenant.email,
      roles: [RoleEnum.ADM],
      tenantId: (tenant.id as Types.ObjectId),
      ativo: true
    });

    //await this.kanbanService.createInitalKanban(user.id, tenant.id);
    
    await this.tagService.createInitalTag(user.id, tenant.id);

    return tenant;
  }
}
