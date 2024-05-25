import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, tap } from 'rxjs';

export class LoggingInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const now = Date.now();
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();
    return next
      .handle()
      .pipe(
        tap(() =>
          console.log(
            `${req.method.toUpperCase()} ${req.originalUrl} ${res.statusCode} ${
              Date.now() - now
            }ms`,
          ),
        ),
      );
  }
}
