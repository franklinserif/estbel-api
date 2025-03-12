import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '@auth/decorators/public';
import { ENV_VAR } from '@configuration/enum/env';
import { AuthService } from '@auth/auth.service';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private configService: ConfigService,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const accessToken = this.extractTokenFromHeader(request);
    const refreshToken = request.cookies?.refreshToken as string | undefined;

    try {
      const admin = await this.authService.verifyTokens(
        accessToken,
        refreshToken,
      );

      const payload = await this.jwtService.verifyAsync(accessToken, {
        secret: this.configService.get<string>(ENV_VAR.JWT_SECRET),
      });

      if (!payload?.sub) {
        throw new UnauthorizedException();
      }

      request['user'] = admin;
    } catch {
      throw new UnauthorizedException(`token it's not valid`);
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
