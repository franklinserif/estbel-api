import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AdminsService } from '@admins/admins.service';
import { PasswordService } from '@shared/libs/password/password.service';
import { Payload, Tokens } from './interfaces/jw';
import { Admin } from '@admins/entities/admin.entity';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { ResetPasswordDto } from './dtos/reset-password';
import { ConfigService } from '@nestjs/config';
import { ENV_VAR } from '@configuration/enum/env';
import {
  FIFTEEN_DAYS_IN_SECONDS,
  FIVE_MINUTES_IN_SECONDS,
} from '@shared/constants/time';

@Injectable()
export class AuthService {
  constructor(
    private admisnService: AdminsService,
    private jwtService: JwtService,
    private passwordService: PasswordService,
    private configService: ConfigService,
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

    if (!isValidPassword) {
      throw new UnauthorizedException(`invalid password`);
    }

    const payload: Omit<Payload, 'exp'> = {
      sub: admin.id,
      email: admin.email,
    };

    const { accessToken, refreshToken } = await this.generateTokens(payload);

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

  /**
   * Changes the password for an admin user
   * @param {ChangePasswordDto} changePasswordDto - The data to update the admin.
   * @returns {Promise<Admin>} The updated admin.
   * @throws {UnauthorizedException} If the password is invalid
   */
  async changePassword(changePasswordDto: ChangePasswordDto): Promise<Admin> {
    const admin = await this.admisnService.findByEmail(changePasswordDto.email);

    const isValidPassword = await this.passwordService.comparePassword(
      changePasswordDto.password,
      admin.password,
    );

    if (!isValidPassword) {
      throw new UnauthorizedException(`invalid password`);
    }

    admin.password = changePasswordDto.newPassword;

    await this.admisnService.update(admin.id, {
      password: changePasswordDto.newPassword,
    });

    delete admin.password;

    return admin;
  }

  /**
   * Resets the password for an admin user
   * @param {ResetPasswordDto} resetPasswordDto - The data to update the admin.
   * @returns {Promise<Admin>} The updated admin.
   */
  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<Admin> {
    const admin = await this.admisnService.findByEmail(resetPasswordDto.email);

    const newPassword = this.passwordService.generateTemporaryPassword();

    await this.admisnService.update(admin.id, { password: newPassword });
    delete admin.password;

    return admin;
  }

  /**
   * Refreshes the access and refresh tokens for an admin user
   * @param {string | undefined} oldAccessToken - The old access token
   * @param {string | undefined} oldRefreshToken - The old refresh token
   * @returns {Promise<Tokens>} The new access and refresh tokens
   */
  async refreshTokens(
    oldAccessToken: string | undefined,
    oldRefreshToken: string | undefined,
  ): Promise<Tokens> {
    const accessPayload = await this.verifyToken(oldAccessToken);
    const resfreshPayload = await this.verifyToken(oldRefreshToken);

    if (accessPayload.sub !== resfreshPayload.sub) {
      throw new UnauthorizedException('Invalid token');
    }

    const isRefreshExpired = this.isTokenExpired(
      resfreshPayload.exp,
      FIFTEEN_DAYS_IN_SECONDS,
    );

    if (isRefreshExpired) {
      throw new UnauthorizedException('Refresh token expired');
    }

    const admin = await this.admisnService.findOne(accessPayload.sub);

    const payload: Omit<Payload, 'exp'> = {
      sub: admin.id,
      email: admin.email,
    };

    const { accessToken, refreshToken } = await this.generateTokens(payload);

    return { accessToken, refreshToken } as Tokens;
  }

  /**
   * Verifies a token
   * @param {string} token - The token to verify
   * @returns {Promise<Payload>} The payload of the token
   * @throws {UnauthorizedException} If the token is invalid
   */
  async verifyToken(token: string): Promise<Payload> {
    if (!token) {
      throw new UnauthorizedException('Token is missing');
    }

    const payload = await this.jwtService.verifyAsync(token, {
      secret: this.configService.get<string>(ENV_VAR.JWT_SECRET),
    });

    if (!payload || !payload.sub) {
      throw new UnauthorizedException('Invalid token');
    }

    return payload;
  }

  /**
   * Generates access and refresh tokens
   * @param {Omit<Payload, 'expiresIn'>} payload - The payload of the token
   * @returns {Promise<Tokens>} The access and refresh tokens
   */
  private async generateTokens(payload: Omit<Payload, 'exp'>): Promise<Tokens> {
    const accessToken = this.jwtService.sign(payload, { expiresIn: '5m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '15d' });

    return { accessToken, refreshToken } as Tokens;
  }

  /**
   * Verifies a access and refresh tokens
   * @param {string | undefined} accessToken - The access token to verify
   * @param {string | undefined} refreshToken - The refresh token to verify
   * @returns {Promise<Admin>} The admin information
   * @throws {UnauthorizedException} If the token is invalid
   */
  async verifyTokens(
    accessToken: string | undefined,
    refreshToken: string | undefined,
  ): Promise<Admin> {
    const accessPayload = await this.verifyToken(accessToken);
    const resfreshPayload = await this.verifyToken(refreshToken);

    if (accessPayload.sub !== resfreshPayload.sub) {
      throw new UnauthorizedException('Invalid token');
    }

    const isAccessExpired = this.isTokenExpired(
      accessPayload.exp,
      FIVE_MINUTES_IN_SECONDS,
    );

    const isRefreshExpired = this.isTokenExpired(
      resfreshPayload.exp,
      FIFTEEN_DAYS_IN_SECONDS,
    );

    if (isAccessExpired || isRefreshExpired) {
      throw new UnauthorizedException('token expired');
    }

    const admin = await this.admisnService.findOne(accessPayload.sub);

    return admin;
  }

  /**
   * Verifies if a token is expired
   * @param {number} expiresIn - The expiration time of the token in seconds
   * @returns {boolean} True if the token is expired, false otherwise
   */
  private isTokenExpired(
    expiresIn: number | undefined,
    expirationTime: number,
  ): boolean {
    if (!expiresIn) {
      return true;
    }

    const currentTimeInSeconds = Math.floor(Date.now() / 1000);
    const expirationTimeInSeconds = currentTimeInSeconds + expiresIn;

    const timeUntilExpiration = expirationTimeInSeconds - currentTimeInSeconds;
    return timeUntilExpiration < expirationTime;
  }
}
