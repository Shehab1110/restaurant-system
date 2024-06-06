import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

interface SuccessResponse<T> {
  isSuccess: boolean;
  message: string;
  data: T;
  errorCode: null;
  errors: any[];
  count?: number;
}

@Injectable()
export class SucessResponseInterceptor<T> implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: T) => {
        const responseObject: SuccessResponse<T> = {
          isSuccess: true,
          message: 'success',
          data,
          errorCode: null,
          errors: [],
        };
        if (Array.isArray(data)) responseObject.count = data.length;
        return responseObject;
      }),
    );
  }
}
