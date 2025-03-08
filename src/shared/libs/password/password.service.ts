import * as bcrypt from 'bcrypt';
import generator from 'generate-password';
import { Injectable, Inject } from '@nestjs/common';
import { IPasswordConfig, IPasswordService } from '@shared/interfaces/password';

export const PASSWORD_CONFIG = 'PASSWORD_CONFIG';

@Injectable()
export class PasswordService implements IPasswordService {
  private readonly config: IPasswordConfig;

  constructor(@Inject(PASSWORD_CONFIG) config: Partial<IPasswordConfig> = {}) {
    this.config = {
      defaultLength: config.defaultLength ?? 12,
      defaultSaltRounds: config.defaultSaltRounds ?? 10,
      useSymbolsByDefault: config.useSymbolsByDefault ?? true,
    };
  }

  /**
   * Generates a temporary password with a specified length.
   * @param {number} [length] - The length of the generated password.
   * @returns {string} The generated temporary password.
   */
  public generateTemporaryPassword(length: number = 16): string {
    return (
      '1T' +
      generator.generate({
        length,
        numbers: true,
        symbols: true,
        uppercase: true,
        lowercase: true,
      })
    );
  }

  /**
   * Hashes a password using bcrypt.
   * @param {string} password - The plain text password to hash.
   * @param {number} saltRounds - The number of salt rounds.
   * @returns {Promise<string>} The hashed password.
   */
  public async hashPassword(
    password: string,
    saltRounds: number = this.config.defaultSaltRounds,
  ): Promise<string> {
    const salt = await bcrypt.genSalt(saltRounds);
    return bcrypt.hash(password, salt);
  }

  /**
   * Compares a plain text password with a hashed password.
   * @param {string} password - The plain text password.
   * @param {string} hashedPassword - The hashed password.
   * @returns {Promise<boolean>} Whether the passwords match.
   */
  public async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}
