import { Controller, Get, Post, Body, UseGuards, Req, BadRequestException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LogsService } from '../auditoria/logs.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantService } from './tenant.service';
import { RoleEnum } from 'src/enum/perfil.enum';
import { Roles } from 'src/decorators/roles.decorator';

@ApiTags('tenant')
@UseGuards(JwtAuthGuard)
@Controller('tenant')
@Roles(RoleEnum.ADM_TOTAL)
export class TenantController {
  constructor(
    private service: TenantService,
    private logService: LogsService) {}

  @Get()
  async findAll() {
    return (await this.service.findAll()).map(tenant => {
      const t = tenant.toObject();
      delete t.__v;
      return t;
    });
  }

  @Post()
  async create(@Body() body: { name: string; email: string; }) {
    return await this.service.create(body);
  }
}
