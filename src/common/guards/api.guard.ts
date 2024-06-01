import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UNAUTHORIZED_REQUEST } from 'src/constants/string';
import { BaseError } from '../helpers/errors';

@Injectable()
export class ApiGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    try {
      const headers = request.headers;
      const apiKeyHeader = headers['x-api-key'];

      if (!apiKeyHeader) {
        throw Error('Required params missing');
      }

      const allowedApiKeysString = Buffer.from(
        process.env.ALLOWED_BACKEND_API_KEYS,
        'base64',
      ).toString();

      const allowedApiKeys = JSON.parse(allowedApiKeysString);

      if (allowedApiKeys.includes(apiKeyHeader)) {
        return true;
      } else {
        throw Error(UNAUTHORIZED_REQUEST);
      }
    } catch (e) {
      console.error(
        `Sorry, Something went wrong in ${request.route.path}: ${e}`,
      );

      throw new BaseError(e.toString());
    }
  }
}
