import { getCustomRepository } from 'typeorm';
import { User } from '../entities/User';
import { UserTokenRepository } from '../repositories/UserTokenRepository';

/**
 * Generates an auth token for the given user.
 * @param user The user to give the token to
 * @returns A token
 */
export async function issueToken(user: User) {
  const tokenRepo = getCustomRepository(UserTokenRepository);
  const token = await tokenRepo.createToken(user);
  return token;
}

/**
 * Validates a token, returning the token if valid, else undefined.
 * @param token The token to validate
 * @returns A UserToken if found, otherwise undefined.
 */
export async function validateToken(token: string) {
  const tokenRepo = getCustomRepository(UserTokenRepository);
  const userToken = await tokenRepo.findByToken(token);
  return userToken;
}

/**
 * Checks if the given strign is in Bearer token format
 * @param token The token/auth value to check
 * @returns True if in the format 'Bearer XXXX...'
 */
export function isBearerToken(token: string) {
  const t = token.trim();
  if (!t.startsWith('Bearer ')) { return false; }
  return true;
}
