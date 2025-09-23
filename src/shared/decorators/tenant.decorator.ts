import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Tenant = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req.user.tenantId;
  },
);

//Exemplo no controller:

// @Get()
// findAll(@Tenant() tenantId: string) {
//   return this.ordersService.findAllByTenant(tenantId);
// }