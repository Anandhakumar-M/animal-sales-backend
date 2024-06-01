import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AppLogger } from 'src/common/helpers/app.logger';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const util = require('util');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const newrelic = require('newrelic');

@Injectable()
export class NewrelicInterceptor implements NestInterceptor {
  constructor(readonly logger: AppLogger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const logger = this.logger;

    logger.info(
      `Parent Interceptor before: ${util.inspect(context.getHandler().name)}`,
    );

    return newrelic.startWebTransaction(context.getHandler().name, function () {
      const transaction = newrelic.getTransaction();

      // const now = Date.now();
      return next.handle().pipe(
        tap(() => {
          logger.info(
            `Parent Interceptor after: ${util.inspect(
              context.getHandler().name,
            )}`,
          );

          return transaction.end();
        }),
      );
    });
  }
}
