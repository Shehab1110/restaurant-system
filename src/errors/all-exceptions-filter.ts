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

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    if (!(exception instanceof HttpException)) {
      const responseBody = {
        isSuccess: false,
        message: 'Something went wrong!',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        data: null,
        errors: ['Something went wrong!'],
      };
      console.log(exception);
      if (exception.code === 11000) {
        responseBody.message = `There is an existing user name: ${exception.keyValue.userName}`;
        responseBody.statusCode = HttpStatus.BAD_REQUEST;
      }

      response.status(responseBody.statusCode).json(responseBody);
    } else {
      const { message } = exception;
      const httpStatus =
        exception.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR;
      const errorMessage = (exception.getResponse() as HttpException).message;
      const errors = Array.isArray(errorMessage)
        ? errorMessage
        : [errorMessage];
      const responseBody = {
        isSuccess: false,
        message,
        statusCode: httpStatus,
        data: null,
        errors,
      };
      response.status(httpStatus).json(responseBody);
    }
  }
}
