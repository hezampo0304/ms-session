import {
  Injectable,
  Logger,
} from '@nestjs/common';

import { Cron } from '@nestjs/schedule';

import { SessionRepository } from '../repositories/session.repository';

@Injectable()
export class SessionSchedulerService {
  private readonly logger =
    new Logger(SessionSchedulerService.name);

  constructor(
    private readonly sessionRepository: SessionRepository,
  ) {}

  @Cron('*/1 * * * *')
  async expireSessions() {
    try {
      const result =
        await this.sessionRepository
          .expireExpiredSessions();

      if (result.count > 0) {
        this.logger.log(
          `Expired sessions: ${result.count}`,
        );
      }
    } catch (error) {
      this.logger.error(
        'Error expiring sessions',
        error instanceof Error
          ? error.stack
          : String(error),
      );
    }
  }
}