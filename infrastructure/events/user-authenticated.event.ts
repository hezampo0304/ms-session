export interface UserAuthenticatedEvent {
  expiresAt: string | number | Date;
  userAgent: string | undefined;
  ipAddress: string | undefined;
  phone: string | undefined;
  displayName: string | undefined;
  lastName: string | undefined;
  firstName: string | undefined;
  email: string;
  eventId: string;
  eventType: 'USER_AUTHENTICATED';
  occurredAt: string;

  userId: string;
  tenantId: string;
  sessionId: string;

  provider: string;
}