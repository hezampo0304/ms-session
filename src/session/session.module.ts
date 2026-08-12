import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

import { SessionController } from './controllers/session.controller';

import { SessionRepository } from './repositories/session.repository';

import { SessionService } from './services/session.service';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SessionValidationService } from './services/session-validation.service';
import { SessionSchedulerService } from './services/session-scheduler.service';
import { InternalServiceGuard } from 'src/common/guards/internal-service.guard';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ConfigModule
  ],

  controllers: [
    SessionController,
  ],

  providers: [
    SessionRepository,
    SessionService,
    SessionValidationService,
    JwtAuthGuard,
    SessionSchedulerService,
    InternalServiceGuard,
  ],

  exports: [
    SessionRepository,
    SessionService,
    SessionValidationService,
    JwtAuthGuard,
  ],
})
export class SessionModule {}