import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AdminsService } from '@admins/admins.service';
import { comparePassword } from '@common/libs/password';
import { Payload, Tokens } from './interfaces/jw';
import { Admin } from '@admins/entities/admin.entity';

@Injectable()
export class AuthService {
  constructor(
    private admisnService: AdminsService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string): Promise<any> {
    const admin = await this.admisnService.findByEmail(email);
    const isValidPassword = await comparePassword(password, admin.password);

    if (isValidPassword) {
      throw new UnauthorizedException(`invalid password`);
    }

    const payload: Payload = {
      sub: admin.id,
      email: admin.email,
    };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '5m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '14d' });

    return { accessToken, refreshToken } as Tokens;
  }

  async validateAdmin(email: string, password: string): Promise<Admin | null> {
    const admin = await this.admisnService.findByEmail(email);

    const isValidPassword = await comparePassword(password, admin.password);

    if (isValidPassword) {
      delete admin.password;

      return admin;
    }

    return null;
  }
}
