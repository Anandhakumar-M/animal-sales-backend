import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { AppLogger } from 'src/common/helpers/app.logger';
import { ApiResponse } from 'src/common/helpers/response';

export class BaseError extends Error {
  data: any;
  errorCode: string;

  constructor(message: string, data: any = null, errorCode = '') {
    super(message);
    this.data = data;
    this.errorCode = errorCode;
  }
}

@Catch()
export class ErrorFilter implements ExceptionFilter {
  constructor(private readonly logger: AppLogger) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    let responseJSON;

    let statusCode = 500;

    if (exception instanceof BaseError) {
      responseJSON = ApiResponse.failure(
        exception.message,
        exception.data,
        exception.errorCode,
      );
    } else if (exception instanceof BadRequestException) {
      statusCode = exception.getStatus();
      let errorMessage = exception.message;
      try {
        errorMessage = JSON.parse(
          JSON.stringify(exception),
        ).response.message.join(', ');
      } catch (_) {}

      responseJSON = ApiResponse.failure(errorMessage);
    } else if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      responseJSON = ApiResponse.failure(exception.message);
    } else if (exception instanceof Error) {
      responseJSON = ApiResponse.failure(exception.message);
    } else {
      responseJSON = ApiResponse.failure('INTERNAL SERVER ERROR!!!');
    }

    this.logger.error(
      `SOMETHING WENT WRONG IN ${request.url} -> RECEIVED ERROR:`,
    );
    this.logger.error(exception);

    response.status(statusCode).json(responseJSON);
  }
}
