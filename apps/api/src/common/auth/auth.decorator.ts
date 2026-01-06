import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AuthCtx = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest<any>();
  return req.auth;
});

export const RequestId = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest<any>();
  return req.requestId as string | undefined;
});
