import crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import {
  UPPER_CASE,
  LOWER_CASE,
  NUMBERS,
  SYMBOLS,
} from '@shared/constants/password';

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

  // Calculamos el valor máximo que no produce sesgo (256 es el rango de un byte).
  const maxValid = 256 - (256 % characters.length);
  let password = '';

  for (let i = 0; i < length; i++) {
    let randomByte: number;

    // "Rejection sampling":
    // Genera un byte y si está fuera de 'maxValid', se repite.
    do {
      randomByte = crypto.randomBytes(1)[0];
    } while (randomByte >= maxValid);

    // Ahora sí aplicamos el módulo de forma segura.
    password += characters[randomByte % characters.length];
  }

  return password;
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
