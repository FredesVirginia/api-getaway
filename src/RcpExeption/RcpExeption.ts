import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Response } from 'express';

@Catch(RpcException)
export class RpcExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const error: any = exception.getError();

    const message =
      typeof error === 'string'
        ? error
        : error?.message || 'Error desconocido';

    const statusCode = error?.statusCode || 400;

    response.status(statusCode).json({
      statusCode,
      message,
      error: 'Bad Request',
    });
  }
}
