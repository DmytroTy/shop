import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from "@nestjs/graphql";
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GqlLocalAuthGuard extends AuthGuard('local') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    ctx.getContext().req.body = ctx.getArgs().loginData;
    return ctx.getContext().req;
  }
}
