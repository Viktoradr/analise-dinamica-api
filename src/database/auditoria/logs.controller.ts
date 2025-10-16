import { Controller, Get, UseGuards } from '@nestjs/common';
import { Types } from 'mongoose';
import { LogsService } from './logs.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LogsObrigatorioEnum } from '../../enum/logs-obrigatorio.enum';
import { RoleEnum } from '../../enum/perfil.enum';
import { Roles } from '../../decorators/roles.decorator';
import { TenantId } from '../../decorators/tenantid.decorator';
import { LogResponseDto } from './dto/logs-response';

@Controller('logs')
@UseGuards(JwtAuthGuard)
export class LogsController {
  constructor(private readonly service: LogsService) { }

  @Get('logsSla')
  @Roles(RoleEnum.OPERACAO, RoleEnum.ADM_TOTAL)
  async logsSla(
    @TenantId() tenantId: Types.ObjectId
  ) {
    const logs = await this.service.findLogs({ tenantId });

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
    @TenantId() tenantId: Types.ObjectId
  ) {
    const logs = await this.service.findLogs({
      tenantId,
      type: { $in: [LogsObrigatorioEnum.LOGIN_FAIL, LogsObrigatorioEnum.LOGIN_SUCCESS] }
    });

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
