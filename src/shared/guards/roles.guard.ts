import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/shared/decorators/roles.decorator';
import { RoleEnum } from 'src/shared/enum/perfil.enum';
import { MENSAGENS } from 'src/shared/constants/mensagens';

//Guard RBAC
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {

    const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(ROLES_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // rota sem restrição de role
    }

    const { user } = ctx.switchToHttp().getRequest();

    if (!user || !user.roles) {
      throw new ForbiddenException(MENSAGENS.USER_NO_ROLE);
    }
    
    const hasRole = requiredRoles.some((role) => user.roles.includes(role));

    if (!hasRole) {
      throw new ForbiddenException(MENSAGENS.ACCESS_ROLE);
    }

    return true;
  }
}