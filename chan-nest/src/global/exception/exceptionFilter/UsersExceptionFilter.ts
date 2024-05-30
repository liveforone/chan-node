import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Request, Response } from 'express';
import { UsersException } from '../customException/UsersException';

@Catch(UsersException)
export class UsersExceptionFilter implements ExceptionFilter {
  catch(exception: UsersException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    response.status(status).json({
      message: exception.message,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
