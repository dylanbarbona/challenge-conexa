import { HttpException } from '@nestjs/common';
import { catchError, throwError } from 'rxjs';

export const handleRpcException = catchError((error) => {
  const err = JSON.parse(error);
  return throwError(() => new HttpException(err.message, err.status));
});
