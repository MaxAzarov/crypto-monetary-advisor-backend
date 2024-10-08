import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Request as IRequest } from 'express';

import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { SignupDto } from './dto/auth-signup.dto';
import { JwtAuthGuard } from './guards';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() loginDto: AuthLoginDto) {
    return this.authService.signIn(loginDto.email, loginDto.password);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signup')
  signUp(@Body() loginDto: SignupDto) {
    return this.authService.signUp(loginDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  public async me(@Request() request: IRequest) {
    return this.authService.me((request as any).user);
  }
}
