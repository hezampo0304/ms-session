import { IsUUID } from 'class-validator';

export class ValidateSessionDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  tenantId: string;

  @IsUUID()
  sessionId: string;
}