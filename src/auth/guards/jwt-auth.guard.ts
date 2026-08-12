import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import type { Request } from 'express';

import { JwtService } from '../services/jwt.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { SessionValidationService } from 'src/session/services/session-validation.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {

  constructor(
    private readonly jwtService: JwtService,
    private readonly sessionValidationService: SessionValidationService,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {

    const request =
      context.switchToHttp().getRequest<Request>();

    const authorization =
      request.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException(
        'Authorization header is required',
      );
    }

    const [type, token] =
      authorization.split(' ');

    if (
      type !== 'Bearer' ||
      !token
    ) {
      throw new UnauthorizedException(
        'Invalid authorization header',
      );
    }

    try {

      const payload =
        await this.jwtService.verifyAccessToken(
          token,
        );

      const user =
        payload as JwtPayload;

      await this.sessionValidationService.validate(
        user,
      );

      request['user'] = user;

      return true;

    } catch (error) {

      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new UnauthorizedException(
        'Invalid or expired token',
      );
    }
  }
}