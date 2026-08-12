import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SessionRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async createUserSnapshot(data: {
    id: string;
    tenantId: string;
    email: string;
    firstName?: string;
    lastName?: string;
    displayName?: string;
    phone?: string;
  }) {
    return this.prisma.userSnapshot.upsert({
      where: {
        id: data.id,
      },
      create: {
        id: data.id,
        tenantId: data.tenantId,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        displayName: data.displayName,
        phone: data.phone,
        status: 'ACTIVE',
      },
      update: {
        tenantId: data.tenantId,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        displayName: data.displayName,
        phone: data.phone,
      },
    });
  }

  async createSession(data: {
    id: string;
    userId: string;
    tenantId: string;
    ipAddress?: string;
    userAgent?: string;
    deviceId?: string;
    expiresAt: Date;
  }) {
    return this.prisma.session.create({
      data: {
        id: data.id,
        userId: data.userId,
        tenantId: data.tenantId,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        deviceId: data.deviceId,
        expiresAt: data.expiresAt,
      },
    });
  }

  async findById(sessionId: string) {
    return this.prisma.session.findUnique({
      where: {
        id: sessionId,
      },
      include: {
        user: true,
      },
    });
  }

  async findActiveById(sessionId: string) {
    return this.prisma.session.findFirst({
      where: {
        id: sessionId,
        status: 'ACTIVE',
      },
      include: {
        user: true,
      },
    });
  }

  async updateLastActivity(sessionId: string) {
    return this.prisma.session.update({
      where: {
        id: sessionId,
      },
      data: {
        lastActivityAt: new Date(),
      },
    });
  }

  async revokeSession(
    sessionId: string,
  ) {
    return this.prisma.session.update({
      where: {
        id: sessionId,
      },
      data: {
        status: 'REVOKED',
        revokedAt: new Date(),
        revokedReason: 'USER_LOGOUT',
      },
    });
  }

  async revokeAllByUserId(
    userId: string,
    reason?: string,
  ) {
    return this.prisma.session.updateMany({
      where: {
        userId,
        status: 'ACTIVE',
      },
      data: {
        status: 'REVOKED',
        revokedAt: new Date(),
        revokedReason: reason,
      },
    });
  }

  async findActiveByUserId(userId: string) {
    return this.prisma.session.findMany({
      where: {
        userId,
        status: 'ACTIVE',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}