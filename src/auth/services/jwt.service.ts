import { Injectable } from '@nestjs/common';

import {
  JwtService as NestJwtService,
} from '@nestjs/jwt';

import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtService {

  constructor(
    private readonly jwt: NestJwtService,
  ) {}

  async verifyAccessToken(
    token: string,
  ): Promise<JwtPayload> {

    return this.jwt.verifyAsync<JwtPayload>(
      token,
      {
        algorithms: ['RS256'],
      },
    );
  }
}