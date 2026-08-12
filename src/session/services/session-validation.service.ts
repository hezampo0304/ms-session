import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { SessionRepository } from '../repositories/session.repository';

import { JwtPayload } from '../../auth/interfaces/jwt-payload.interface';

@Injectable()
export class SessionValidationService {
  constructor(
    private readonly sessionRepository: SessionRepository,
  ) {}

  async validate(payload: JwtPayload) {
  const {
    sub: userId,
    tenantId,
    sessionId,
  } = payload;

  if (!userId) {
    throw new UnauthorizedException(
      'User identifier is missing from token.',
    );
  }

  if (!tenantId) {
    throw new UnauthorizedException(
      'Tenant identifier is missing from token.',
    );
  }

  if (!sessionId) {
    throw new UnauthorizedException(
      'Session identifier is missing from token.',
    );
  }

  return this.validateSession(
    userId,
    tenantId,
    sessionId,
  );
}

  async validateSession(
  userId: string,
  tenantId: string,
  sessionId: string,
) {
  const session =
    await this.sessionRepository.findById(
      sessionId,
    );

  if (!session) {
    throw new UnauthorizedException(
      'Session not found.',
    );
  }

  if (session.status !== 'ACTIVE') {
    throw new UnauthorizedException(
      'Session is not active.',
    );
  }

  if (session.expiresAt <= new Date()) {
    throw new UnauthorizedException(
      'Session has expired.',
    );
  }

  if (session.userId !== userId) {
    throw new UnauthorizedException(
      'Session does not belong to the user.',
    );
  }

  if (session.tenantId !== tenantId) {
    throw new UnauthorizedException(
      'Session does not belong to the tenant.',
    );
  }

  if (session.user.status !== 'ACTIVE') {
    throw new UnauthorizedException(
      'User is not active.',
    );
  }

  return session;
}
}