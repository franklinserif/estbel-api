import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AdminsService } from '@admins/admins.service';
import { PasswordService } from '@shared/libs/password/password.service';
import { Payload, Tokens } from './interfaces/jw';
import { Admin } from '@admins/entities/admin.entity';

@Injectable()
export class AuthService {
  constructor(
    private admisnService: AdminsService,
    private jwtService: JwtService,
    private passwordService: PasswordService,
  ) {}

  /**
   * Authenticates an admin user and generates access and refresh tokens
   * @param {string} email - The admin's email address
   * @param {string} password - The admin's password
   * @returns {Promise<Tokens>} Object containing access and refresh tokens
   * @throws {UnauthorizedException} If the password is invalid
   */
  async signIn(email: string, password: string): Promise<any> {
    const admin = await this.admisnService.findByEmail(email);

    const isValidPassword = await this.passwordService.comparePassword(
      password,
      admin.password,
    );

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

  /**
   * Validates an admin's credentials
   * @param {string} email - The admin's email address
   * @param {string} password - The admin's password
   * @returns {Promise<Admin | null>} Returns the admin object without password if valid, null otherwise
   */
  async validateAdmin(email: string, password: string): Promise<Admin | null> {
    const admin = await this.admisnService.findByEmail(email);

    const isValidPassword = await this.passwordService.comparePassword(
      password,
      admin.password,
    );

    if (isValidPassword) {
      delete admin.password;

      return admin;
    }

    return null;
  }
}
