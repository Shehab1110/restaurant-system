import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);

// * Note that validateCustomDecorators option must be set to true. ValidationPipe does not validate arguments annotated with the custom decorators by default.
// * For example, you should use the User decorator as follows: @User(new ValidationPipe({ validateCustomDecorators: true })).
