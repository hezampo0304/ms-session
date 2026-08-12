import {
  Controller,
  Delete,
  Get,
  Param,
  Req,
  UseGuards,
  Post,
  Body,
} from '@nestjs/common';

import type { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { SessionService } from '../services/session.service';
import { SessionValidationService } from '../services/session-validation.service';
import { InternalServiceGuard } from 'src/common/guards/internal-service.guard';
import { ValidateSessionDto } from '../dto/validate-session.dto';


@Controller('session')
export class SessionController {
  constructor(
    private readonly sessionService: SessionService,
    private readonly sessionValidationService: SessionValidationService,
  ) {}

  @Get('current')
  @UseGuards(JwtAuthGuard)
  async current(
    @Req() request: Request,
  ) {
    return {
      success: true,
      message: 'Session is valid.',
      user: request['user'],
    };
  }

@Get()
@UseGuards(JwtAuthGuard)
async getSessions(
  @Req() request: Request,
) {
  const user = request['user'] as JwtPayload;

  const sessions =
    await this.sessionService.getUserSessions(
      user.sub,
      user.sessionId,
    );

  return {
    success: true,
    data: sessions,
  };
}

@Delete(':sessionId')
@UseGuards(JwtAuthGuard)
async revokeSession(
  @Param('sessionId') sessionId: string,
  @Req() request: Request,
) {
  const user = request['user'] as JwtPayload;

  return this.sessionService.revokeUserSession(
    sessionId,
    user.sub,
    user.sessionId,
  );
}

@Post('revoke-all')
@UseGuards(JwtAuthGuard)
async revokeAllSessions(
  @Req() request: Request,
): Promise<{ success: boolean; message: string; revokedSessions: number; }> {
  const user = request['user'] as JwtPayload;

  return this.sessionService.revokeAllOtherSessions(
    user.sub,
    user.sessionId,
  );
}

@Post('internal/validate')
@UseGuards(InternalServiceGuard)
async validateInternalSession(
  @Body() dto: ValidateSessionDto,
) {
  const session =
    await this.sessionValidationService.validateSession(
      dto.userId,
      dto.tenantId,
      dto.sessionId,
    );

  return {
    success: true,
    valid: true,
    sessionId: session.id,
  };
}


}