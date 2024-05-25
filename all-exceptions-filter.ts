import { BaseExceptionFilter } from '@nestjs/core';
import {
  ExceptionFilter,
  HttpException,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { Logger } from '@nestjs/common';

@Catch()
export class AllExceptionsFilter
  extends BaseExceptionFilter
  implements ExceptionFilter
{
  private logger = new Logger(AllExceptionsFilter.name);
  catch(exception: any, host: ArgumentsHost): void {
    this.logger.error(`An Exception has been thrown!\n${exception}`);
    let message: string;
    let statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    if (!(exception instanceof HttpException)) {
      console.log(exception);
      if (exception.code === 11000) {
        message = `There is an existing user name: ${exception.keyValue.userName}`;
        statusCode = HttpStatus.BAD_REQUEST;
      }

      response.status(statusCode).json({
        status: 'fail',
        statusCode,
        message: message ?? 'Something bad happened!',
      });
    } else {
      interface Res {
        message: string | string[];
        error: string;
        statusCode: number;
      }
      const res = exception.getResponse();
      if (typeof res === 'object') {
        const resObj = res as Res;
        response.status(exception.getStatus()).json({
          ...resObj,
        });
      } else {
        response.status(exception.getStatus()).json({
          statusCode: exception.getStatus(),
          message: exception.message,
        });
      }
    }
  }
}
