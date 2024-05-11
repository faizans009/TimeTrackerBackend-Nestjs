/* eslint-disable prettier/prettier */
import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    BadRequestException,
    HttpStatus,
    HttpException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ValidationError } from 'class-validator';
import { ResponseModel } from '../response.model';

@Injectable()
export class ValidationInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            catchError((error) => {
                if (error instanceof BadRequestException) {
                    const validationError = error.getResponse() as ValidationError;
                    if (validationError['error'] === 'Bad Request') {
                        throw new HttpException(
                            new ResponseModel(
                                false,
                                null,
                                'Error!',
                                Array.isArray(validationError['message'])
                                    ? validationError['message']
                                    : [validationError['message']],
                            ),
                            HttpStatus.OK,
                        );
                    }
                }
                return throwError(error);
            }),
        );
    }
}
