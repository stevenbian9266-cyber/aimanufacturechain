import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCodes } from '@mfg/shared';
import { AppError } from './app-error';
import { fail } from './response';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();

    if (exception instanceof AppError) {
      return res.status(exception.status).json(fail(exception.code, exception.message, exception.details));
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const msg = exception.message || 'HttpException';

      const code =
        status === 400
          ? ErrorCodes.VALIDATION_ERROR
          : status === 401
            ? ErrorCodes.AUTH_REQUIRED
            : status === 403
              ? ErrorCodes.FORBIDDEN
              : status === 404
                ? ErrorCodes.RESOURCE_NOT_FOUND
                : status === 429
                  ? ErrorCodes.RATE_LIMITED
                  : ErrorCodes.INTERNAL_ERROR;

      return res.status(status).json(fail(code, msg));
    }

    // eslint-disable-next-line no-console
    console.error(exception);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(fail(ErrorCodes.INTERNAL_ERROR, 'Internal error'));
  }
}
