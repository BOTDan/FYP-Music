import { NextFunction, Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { User } from '../entities/User';
import { UserToken } from '../entities/UserToken';
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
 * Deletes a token, making it invalid.
 * @param token The token to delete
 * @returns The deleted token
 */
export async function deleteToken(token: UserToken) {
  const tokenRepo = getCustomRepository(UserTokenRepository);
  const deletedToken = await tokenRepo.deleteToken(token);
  return deletedToken;
}

/**
 * Attempts to extract a token from the given auth header.
 * Requires the header to be in the format ```'Bearer xyz'```
 * Throws an error if the token is not in the correct format
 * @param header The auth header to extract the token from
 * @returns The extracted token
 */
export function extractBearerToken(header: string) {
  const parts = header.split(' ');
  if (parts.length !== 2) { throw new Error('String is not in \'Bearer xyz\' format.'); }
  if (parts[0] !== 'Bearer') { throw new Error('String is not in \'Bearer xyz\' format.'); }
  // Can do checks in the future here for if the token is the right size
  return parts[1];
}

/**
 * Middleware to prevent unauthenticated access to a route
 * @param request Express request object
 * @param response Express response object
 * @param next Express next function
 */
export async function requireAuthentication(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const authHeader = request.headers.authorization;
    if (!authHeader) { throw new Error('No auth headers sent'); }
    const token = extractBearerToken(authHeader);
    const foundToken = await validateToken(token);
    if (foundToken) {
      request.token = foundToken;
      request.user = foundToken.user;
      next();
    } else {
      response.send('Unauthorized scrub');
    }
  } catch (e) {
    response.send(`Auth failed with the following error: ${e}`);
  }
}
