import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { RoleEnum } from '../../../enum/perfil.enum';

@Injectable()
export class ReprocessGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const user = req.user; // vem do JWT

    // Perfis permitidos
    const allowedRoles = [RoleEnum.ADM, RoleEnum.ADM_TOTAL, RoleEnum.OPERACAO];

    const hasRole = user.roles.some((role: RoleEnum) => allowedRoles.includes(role));

    if (!hasRole) {
      throw new ForbiddenException('Você não tem permissão para reprocessar laudos');
    }

    return true;
  }
}
