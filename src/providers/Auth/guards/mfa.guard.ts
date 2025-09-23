import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { RoleEnum } from 'src/shared/enum/perfil.enum';

@Injectable()
export class MfaGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest();
    const { user } = req;

    const sensitiveRoles = [RoleEnum.AUDITORIA, RoleEnum.ADM, RoleEnum.OPERACAO, RoleEnum.ADM_TOTAL];

    if (sensitiveRoles.some(r => user.roles.includes(r)) && !user.mfaVerified) {
      throw new ForbiddenException('MFA obrigatório para este perfil');
    }

    return true;
  }
}

// 5. Exemplo de rota protegida
// @Get('logs')
// @UseGuards(JwtAuthGuard, MfaGuard)
// @Roles('auditor', 'admin')
// findLogs(@Tenant() tenantId: string) {
//   return this.logsService.findAllByTenant(tenantId);
// }