import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { catchError, Observable, tap } from 'rxjs';
import { AuditLog, AuditLogDocument } from 'src/database/logs/schemas/audit-log.schema';
import { EventEnum } from 'src/shared/enum/event.enum';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    @InjectModel(AuditLog.name) private auditModel: Model<AuditLogDocument>,
  ) { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const user = req.user;

    const { method, originalUrl, body, params, query } = req;

    return next.handle().pipe(
      tap(async (result) => {
         await this.auditModel.create({
          userId: user?.id,
          // tenantId: user?.tenantId,
          action: `${method} ${originalUrl}`,
          event: EventEnum.AUDIT,
          resource: params?.id ? `Resource:${params.id}` : originalUrl,
          details: {
            body,
            query,
            result,
          }
        });
        // só registra ações privilegiadas
        // if (
        //   ['POST', 'PUT', 'DELETE'].includes(method) &&
        //   user &&
        //   !user.roles.includes(RoleEnum.CLIENTE) // clientes só geram log explícito no service
        // ) {
        //   await this.auditModel.create({
        //     userId: user.sub,
        //     // tenantId: user.tenantId,
        //     action: `${method} ${originalUrl}`,
        //     resource: params?.id ? `Resource:${params.id}` : originalUrl,
        //     details: {
        //       body,
        //       query,
        //       result,
        //     },
        //   });
        // }
      }),
      catchError(async (err) => {
        // Log de erro
        const stackLines = err.stack?.split('\n') || [];
        const origin = stackLines[1]?.trim(); // a primeira linha útil geralmente indica a função que lançou
        const match = origin.match(/at\s([^\s]+)/);
        const func = match ? match[1] : originalUrl;
        
        await this.auditModel.create({
          userId: user?.userId,
          // tenantId: user?.tenantId,
          action: `${method} ${originalUrl}`,
          event: EventEnum.ERROR,
          resource: func,
          details: { success: false, error: err.message, stack: err.stack },
        });

        throw err; // Re-lança a exceção para o Nest tratar normalmente
      }),
    );
  }
}


//LogsService grava em tabela append-only (sem update/delete).

//2. Por Módulo
// Se você quer auditar somente um domínio (ex.: UsersModule, OrdersModule), pode registrar no providers do módulo:
// users/users.module.ts
// import { Module } from '@nestjs/common';
// import { APP_INTERCEPTOR } from '@nestjs/core';
// import { AuditInterceptor } from '../common/interceptors/audit.interceptor';
// import { LogsModule } from '../logs/logs.module';
// import { UsersController } from './users.controller';
// import { UsersService } from './users.service';

// @Module({
//   imports: [LogsModule],
//   controllers: [UsersController],
//   providers: [
//     UsersService,
//     {
//       provide: APP_INTERCEPTOR,
//       useClass: AuditInterceptor,
//     },
//   ],
// })
// export class UsersModule {}

// 🔹 3. Por Controller ou Método específico
// Se quiser auditar apenas algumas rotas críticas, aplique com @UseInterceptors:
// orders.controller.ts
// import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
// import { AuditInterceptor } from '../common/interceptors/audit.interceptor';
// import { JwtAuthGuard } from '../auth/guards/jwt.guard';

// @Controller('orders')
// export class OrdersController {
//   @Get()
//   @UseGuards(JwtAuthGuard, ReprocessGuard)
//   @UseInterceptors(AuditInterceptor) // 🔒 todas as rotas daqui terão log automático
//   findAll() {
//     return [{ orderId: 1, value: 100 }];
//   }
// }

