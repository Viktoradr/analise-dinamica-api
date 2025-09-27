import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const MethodName = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const handler = ctx.getHandler();
    return handler.name;
  },
);

// Decorator para capturar nome da classe + método
export const ClassMethodName = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const classRef = ctx.getClass();
    const handler = ctx.getHandler();
    return `${classRef.name}.${handler.name}`;
  },
);