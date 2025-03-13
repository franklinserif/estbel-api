import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { Request, Response } from 'express';
import { SentryExceptionCaptured } from '@sentry/nestjs';

@Catch(QueryFailedError)
export class GlobalErrorFilter implements ExceptionFilter {
  private readonly logger: Logger = new Logger(GlobalErrorFilter.name);

  @SentryExceptionCaptured()
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    const message = 'Internal server error';

    if (exception.driverError && (exception.driverError as any)?.code) {
      const pgErrorCode = (exception.driverError as any).code;

      switch (pgErrorCode) {
        case '23505':
          this.logger.error(
            `Duplicate entry error: ${exception.message}`,
            exception.stack,
          );
          response.status(HttpStatus.CONFLICT).json({
            statusCode: HttpStatus.CONFLICT,
            timestamp: new Date().toISOString(),
            message: 'Duplicate entry',
            error: 'Conflict',
          });
          return;
        case '23503':
          this.logger.error(
            `Foreign key violation error: ${exception.message}`,
            exception.stack,
          );
          response.status(HttpStatus.BAD_REQUEST).json({
            statusCode: HttpStatus.BAD_REQUEST,
            timestamp: new Date().toISOString(),
            message: 'Foreign key violation',
            error: 'Bad Request',
          });
          return;
        case '23502':
          this.logger.error(
            `Not null violation error: ${exception.message}`,
            exception.stack,
          );
          response.status(HttpStatus.BAD_REQUEST).json({
            statusCode: HttpStatus.BAD_REQUEST,
            timestamp: new Date().toISOString(),
            message: 'Not null violation',
            error: 'Bad Request',
          });
          return;

        default:
          this.logger.error(
            `Unhandled database error: ${exception.message}`,
            exception.stack,
          );
          break;
      }
    }

    this.logger.error(`${exception.message}`, exception.stack);
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
