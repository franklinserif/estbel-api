import crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { Injectable, Inject } from '@nestjs/common';
import {
  UPPER_CASE,
  LOWER_CASE,
  NUMBERS,
  SYMBOLS,
} from '@shared/constants/password';
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
   * @param {boolean} [useSymbols] - Whether to include special characters.
   * @returns {string} The generated temporary password.
   */
  public generateTemporaryPassword(
    length: number = this.config.defaultLength,
    useSymbols: boolean = this.config.useSymbolsByDefault,
  ): string {
    let characters = UPPER_CASE + LOWER_CASE + NUMBERS;

    if (useSymbols) {
      characters += SYMBOLS;
    }

    // Calculate the maximum value that doesn't produce bias (256 is the range of a byte)
    const maxValid = 256 - (256 % characters.length);
    let password = '';

    for (let i = 0; i < length; i++) {
      let randomByte: number;

      // "Rejection sampling":
      // Generate a byte and if it's outside 'maxValid', repeat
      do {
        randomByte = crypto.randomBytes(1)[0];
      } while (randomByte >= maxValid);

      // Now we can safely apply the modulo
      password += characters[randomByte % characters.length];
    }

    return password;
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
    return bcrypt.compare(password, hashedPassword);
  }
}
