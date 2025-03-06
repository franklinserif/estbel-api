import { Response } from 'express';
import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtGuard } from '@common/guards/jwt.guard';
import { AuthService } from '@auth/auth.service';
import { LoginDto } from '@auth/dtos/login.dto';
import { ConfigService } from '@nestjs/config';
import { ENV_VAR } from '@configuration/enum/env';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('login')
  async signIn(@Body() loginDto: LoginDto, @Res() res: Response) {
    const { accessToken, refreshToken } = await this.authService.signIn(
      loginDto.email,
      loginDto.password,
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: this.configService.get<string>(ENV_VAR.NODE_ENV) === 'prod',
      maxAge: 14 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken });
  }

  @UseGuards(JwtGuard)
  @Get('test')
  test(@Request() req) {
    return req.user;
  }
}
