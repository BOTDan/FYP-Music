import { randomInt } from 'crypto';

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
