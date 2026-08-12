import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

@Injectable()
export class InternalServiceGuard
  implements CanActivate
{
  constructor(
    private readonly configService: ConfigService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean {
    const request =
      context.switchToHttp().getRequest();

    const authorization =
      request.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException(
        'Internal service token is required.',
      );
    }

    const [type, token] =
      authorization.split(' ');

    if (
      type !== 'Bearer' ||
      !token
    ) {
      throw new UnauthorizedException(
        'Invalid authorization format.',
      );
    }

    const expectedToken =
      this.configService.getOrThrow<string>(
        'INTERNAL_SERVICE_TOKEN',
      );

    if (token !== expectedToken) {
      throw new UnauthorizedException(
        'Invalid internal service token.',
      );
    }

    return true;
  }
}