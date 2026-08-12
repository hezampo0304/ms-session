import {
  Controller,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';

import type { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';


@Controller('session')
export class SessionController {

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
}