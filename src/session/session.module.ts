import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

import { SessionController } from './controllers/session.controller';

import { SessionRepository } from './repositories/session.repository';

import { SessionService } from './services/session.service';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SessionValidationService } from './services/session-validation.service';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
  ],

  controllers: [
    SessionController,
  ],

  providers: [
    SessionRepository,
    SessionService,
    SessionValidationService,
    JwtAuthGuard,
  ],

  exports: [
    SessionRepository,
    SessionService,
    SessionValidationService,
    JwtAuthGuard,
  ],
})
export class SessionModule {}