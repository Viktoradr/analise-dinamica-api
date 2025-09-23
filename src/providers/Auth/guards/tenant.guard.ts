import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

//Guard ABAC (tenant):
@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest();
    const { user, params, body } = req;

    // Exemplo: usuário só pode acessar dados do próprio tenant
    if (params.tenantId && params.tenantId !== user.tenantId) return false;
    if (body.tenantId && body.tenantId !== user.tenantId) return false;

    return true;
  }
}