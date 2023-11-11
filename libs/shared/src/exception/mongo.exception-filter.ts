import {
  ArgumentsHost,
  Catch,
  ConflictException,
  ExceptionFilter,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { MongoServerError } from 'mongodb';
import { throwError } from 'rxjs';

@Catch(MongoServerError)
export class MongoExceptionFilter implements ExceptionFilter {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  catch(exception: MongoServerError, host: ArgumentsHost) {
    let httpException;
    switch (exception.code) {
      case 11000:
        httpException = new ConflictException();
        break;
      default:
        httpException = new InternalServerErrorException();
    }

    return throwError(() => {
      return JSON.stringify({
        status: httpException.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR,
        message: httpException.message || exception.message,
      });
    });
  }
}
