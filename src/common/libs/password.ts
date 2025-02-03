import crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import {
  UPPER_CASE,
  LOWER_CASE,
  NUMBERS,
  SYMBOLS,
} from '@common/constants/password';

/**
 * Generates a temporary password with a specified length.
 * @param {number} [length=12] - The length of the generated password.
 * @param {boolean} [useSymbols=true] - Whether to include special characters.
 * @returns {string} The generated temporary password.
 */
export function generateTemporaryPassword(
  length: number = 12,
  useSymbols: boolean = true,
): string {
  let characters = UPPER_CASE + LOWER_CASE + NUMBERS;

  if (useSymbols) {
    characters += SYMBOLS;
  }

  return Array.from(crypto.randomFillSync(new Uint8Array(length)))
    .map((x) => characters[x % characters.length])
    .join('');
}

/**
 * Hashes a password using bcrypt.
 * @param {string} password - The plain text password to hash.
 * @param {number} saltRounds - The number of salt rounds (default: 10).
 * @returns {Promise<string>} The hashed password.
 */
export async function hashPassword(
  password: string,
  saltRounds: number = 10,
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
export async function comparePassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}
