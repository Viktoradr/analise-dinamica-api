import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { catchError, Observable, tap } from 'rxjs';
import { LogsService } from '@database/logs/logs.service';
import { EventEnum } from '../enum/event.enum';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private service: LogsService) { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const user = req.user;

    const { method, originalUrl, body, params, query } = req;

    return next.handle().pipe(
      tap(async (result) => {
         await this.service.createLog({
          userId: user?.id,
          // tenantId: user?.tenantId,
          action: `${method} ${originalUrl}`,
          eventType: EventEnum.AUDIT,
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
        
        await this.service.createLog({
          userId: user?.userId,
          // tenantId: user?.tenantId,
          action: `${method} ${originalUrl}`,
          eventType: EventEnum.ERROR,
          resource: func,
          details: { success: false, error: err.message, stack: err.stack },
        });

        throw err; // Re-lança a exceção para o Nest tratar normalmente
      }),
    );
  }
}