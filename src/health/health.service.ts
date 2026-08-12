import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HealthService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async check() {
    let database = 'disconnected';

    try {
      await this.prisma.$queryRaw`SELECT 1`;
      database = 'connected';
    } catch {
      database = 'disconnected';
    }

    return {
      success: true,
      service: 'ms-session',
      database,
    };
  }
}