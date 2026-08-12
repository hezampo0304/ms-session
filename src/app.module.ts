import { Module } from '@nestjs/common';

import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { KafkaModule } from 'infrastructure/kafka/kafka.module';
import { SessionModule } from './session/session.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    PrismaModule,
    HealthModule,
    AuthModule,
    KafkaModule,
    SessionModule,
    ScheduleModule.forRoot(),
  ],
})
export class AppModule {}