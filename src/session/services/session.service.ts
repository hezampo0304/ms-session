import { Injectable } from '@nestjs/common';

import { SessionRepository } from '../repositories/session.repository';

@Injectable()
export class SessionService {
  constructor(
    private readonly sessionRepository: SessionRepository,
  ) {}

  async createSession(data: {
    id: string;
    userId: string;
    tenantId: string;
    email: string;
    firstName?: string;
    lastName?: string;
    displayName?: string;
    phone?: string;
    ipAddress?: string;
    userAgent?: string;
    deviceId?: string;
    expiresAt: Date;
    }) {
    await this.sessionRepository.createUserSnapshot({
      id: data.userId,
      tenantId: data.tenantId,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      displayName: data.displayName,
      phone: data.phone,
    });

    const session =
      await this.sessionRepository.createSession({
        id: data.id,
        userId: data.userId,
        tenantId: data.tenantId,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        deviceId: data.deviceId,
        expiresAt: data.expiresAt,
      });

    return {
      sessionId: session.id,
      userId: session.userId,
      tenantId: session.tenantId,
      status: session.status,
      createdAt: session.createdAt,
      expiresAt: session.expiresAt,
    };
  }

  async getSession(sessionId: string) {
    return this.sessionRepository.findById(sessionId);
  }

  async getActiveSession(sessionId: string) {
    return this.sessionRepository.findActiveById(sessionId);
  }

  async updateActivity(sessionId: string) {
    return this.sessionRepository.updateLastActivity(
      sessionId,
    );
  }

  async revokeSession(
    sessionId: string,
  ) {
    return this.sessionRepository.revokeSession(
      sessionId,
    );
  }

  async revokeAllSessions(
    userId: string,
    reason?: string,
  ) {
    return this.sessionRepository.revokeAllByUserId(
      userId,
      reason,
    );
  }

  async getUserSessions(userId: string) {
    return this.sessionRepository.findActiveByUserId(
      userId,
    );
  }
}