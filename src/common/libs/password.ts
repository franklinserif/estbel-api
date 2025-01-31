import crypto from 'crypto';
import {
  UPPER_CASE,
  LOWER_CASE,
  NUMBERS,
  SYMBOLS,
} from '@common/constants/password';

/**
 * Generates a temporary password with a specified length.
 *
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
