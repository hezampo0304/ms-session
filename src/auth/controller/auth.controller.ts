import {
  Controller,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';

import type { Request } from 'express';

import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Req() request: Request) {

    return {
      authenticated: true,
      user: request['user'],
    };
  }
}