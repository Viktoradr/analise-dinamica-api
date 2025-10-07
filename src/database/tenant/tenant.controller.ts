import { Controller, Get, Post, Body, UseGuards, Req, BadRequestException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LogsService } from '../auditoria/logs.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantService } from './tenant.service';

@ApiTags('tenant')
@UseGuards(JwtAuthGuard)
@Controller('tenant')
export class TenantController {
  constructor(
    private usersService: TenantService,
    private logService: LogsService) {}

  @Post()
  async create(@Body() body: { name: string; email: string; }) {
    return this.usersService.create(body);
  }
}
