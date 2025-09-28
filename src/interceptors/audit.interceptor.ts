import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { catchError, Observable, tap } from 'rxjs';
import { LogsService } from '../database/auditoria/logs.service';
import { EventEnum } from '../enum/event.enum';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuditInterceptor.name);

  constructor(private service: LogsService) { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const classRef = context.getClass();
    const handler = context.getHandler();
    
    const className = classRef.name;
    const methodName = handler.name;
    const fullMethodName = `${className}.${methodName}`;
    const url = request.url;
    const method = request.method;

    const allParams = {
      route: request.params,
      query: request.query,
      body: request.body
    };

    const startTime = Date.now();

    this.logger.log(`→ ${method} ${url} | ${fullMethodName} - Iniciando`);
    const user = request.user;

    return next.handle().pipe(
      catchError(async (err) => {
        const duration = Date.now() - startTime;
        this.logger.log(`← ${method} ${url} | ${fullMethodName} - Concluído (${duration}ms)`);

        // const stackLines = err.stack?.split('\n') || [];
        // const origin = stackLines[1]?.trim();
        // const match = origin.match(/at\s([^\s]+)/);
        // const func = match ? match[1] : url;
        
        await this.service.createLog({
          event: EventEnum.ERROR,
          userId: user?.userId,
          tenantId: user?.tenantId,
          action: `${method} ${url}`,
          method: fullMethodName,
          message: err.message,
          details: { 
            stack: err.stack,
            params: allParams
          },
        });

        throw err; // Re-lança a exceção para o Nest tratar normalmente
      }),
    );
  }
}