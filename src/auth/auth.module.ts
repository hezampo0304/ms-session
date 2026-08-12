import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { JwtService } from './services/jwt.service';

import { join } from 'path';
import { readFileSync } from 'fs';

@Module({
  imports: [
    ConfigModule,

    JwtModule.register({
      publicKey: readFileSync(
        join(process.cwd(), 'jwt-public.pem'),
        'utf8',
      ),

      verifyOptions: {
        algorithms: ['RS256'],
      },
    }),
  ],

  providers: [
    JwtService,
  ],

  exports: [
    JwtService,
  ],
})
export class AuthModule {}