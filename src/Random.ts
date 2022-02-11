import { randomBytes, randomInt } from 'crypto';

/**
 * Generates a random entity ID.
 * May not be unique, but extremely likely to be
 * @returns A random entity ID
 */
export function createRandomID() {
  const start = randomInt(10000000, 100000000);
  const end = randomInt(0, 100000000).toString().padStart(8, '0');
  return `${start}${end}`;
}

// The length of tokens generated, by default
export const TOKEN_LENGTH = 64;
/**
 * Generates a random token.
 * @param length The length of the token. Should be left default.
 * @returns A random token
 */
export function createRandomToken(length = TOKEN_LENGTH) {
  const token = randomBytes(length).toString('hex');
  return token;
}
