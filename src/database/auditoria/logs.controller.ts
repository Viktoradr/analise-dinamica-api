import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Types } from 'mongoose';
import { LogsService } from './logs.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LogsObrigatorioEnum } from '../../enum/logs-obrigatorio.enum';
import { RoleEnum } from '../../enum/perfil.enum';
import { Roles } from '../../decorators/roles.decorator';
import { TenantId } from '../../decorators/tenantid.decorator';
import { LogResponseDto } from './dto/logs-response';
import { EventEnum } from 'src/enum/event.enum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@ApiTags('logs')
@Controller('logs')
export class LogsController {
  constructor(private readonly service: LogsService) { }

  @Get('logsSla')
  @Roles(RoleEnum.OPERACAO, RoleEnum.ADM_TOTAL)
  async logsSla(
    @Query() params: {
      event?: EventEnum;
      type?: LogsObrigatorioEnum[];
      message?: string;
      userName?: string;
      tenantName?: string;
      dtInicio?: Date | string;
      dtFim?: Date | string;
    },
    @TenantId() tenantId: Types.ObjectId
  ) {
    const logs = await this.service.findLogs(tenantId, params);

    return logs.map(log => new LogResponseDto({
      event: log.event,
      type: log.type,
      userName: (log.userId as any)?.nome,
      tenantName: (log.tenantId as any)?.name,
      message: log.message,
      createdAt: log.createdAt
    }));
  }

  @Get('logsAcesso')
  @Roles(RoleEnum.AUDITORIA, RoleEnum.ADM_TOTAL)
  async logsAcesso(
    @Query() params: {
      event?: EventEnum;
      type?: LogsObrigatorioEnum[];
      message?: string;
      userName?: string;
      tenantName?: string;
      dtInicio?: Date | string;
      dtFim?: Date | string;
    },
    @TenantId() tenantId: Types.ObjectId
  ) {
    params.type = [LogsObrigatorioEnum.LOGIN_FAIL, LogsObrigatorioEnum.LOGIN_SUCCESS];
    const logs = await this.service.findLogs(tenantId, params);

    return logs.map(log => new LogResponseDto({
      event: log.event,
      type: log.type,
      userName: (log.userId as any)?.nome,
      tenantName: (log.tenantId as any)?.name,
      message: log.message,
      createdAt: log.createdAt
    }));
  }
}
