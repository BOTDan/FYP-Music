import { NextFunction, Request, Response } from 'express';
import { getConnection, getCustomRepository } from 'typeorm';
import { AuthAccount } from '../entities/AuthAccount';
import { User } from '../entities/User';
import { UserToken } from '../entities/UserToken';
import { BadRequestError, NotAuthenticatedError } from '../errors/httpstatus';
import { AuthAccountLinkTokenRepository } from '../repositories/AuthAccountLinkTokenRepository';
import { AuthAccountRepository } from '../repositories/AuthAccountRepository';
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
 * Updates the stored access/refresh tokens against an auth account
 * @param authAccount The auth account to save to
 * @param accessToken The access token to store
 * @param refreshToken The refresh token to store
 * @returns The updated account
 */
export async function updateStoredTokens(
  account: AuthAccount,
  accessToken: string,
  refreshToken?: string,
) {
  const authAccountRepo = getCustomRepository(AuthAccountRepository);
  return authAccountRepo.updateTokens(account, accessToken, refreshToken);
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
  if (parts.length !== 2) { throw new BadRequestError('Authorization header is not in \'Bearer xyz\' format.'); }
  if (parts[0] !== 'Bearer') { throw new BadRequestError('Authorization header is not in \'Bearer xyz\' format.'); }
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
    if (!authHeader) { throw new NotAuthenticatedError(); }
    const token = extractBearerToken(authHeader);
    const foundToken = await validateToken(token);
    if (foundToken) {
      request.token = foundToken;
      next();
    } else {
      next(new NotAuthenticatedError());
    }
  } catch (e) {
    next(e);
  }
}

/**
 * Middleware to attempt to authenticate users before proceeding
 * @param request Express request object
 * @param response Express response object
 * @param next Express next function
 */
export async function preferAuthentication(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const authHeader = request.headers.authorization;
    if (!authHeader) { next(); return; }
    const token = extractBearerToken(authHeader);
    const foundToken = await validateToken(token);
    if (foundToken) {
      request.token = foundToken;
      next();
    } else {
      // If someone is trying to authenticate, but has failed,
      // We should still return the error to them
      next(new NotAuthenticatedError());
    }
  } catch (e) {
    next(e);
  }
}

/**
 * Links an auth account to a user based on the link token given.
 * @param user The user to link the account to
 * @param linkToken The token
 * @returns The auth account that was linked
 */
export async function linkAccount(user: User, linkToken: string) {
  // TODO: Token checks
  const connection = getConnection();
  return connection.transaction(async (entityManager) => {
    const linkTokenRepo = getCustomRepository(AuthAccountLinkTokenRepository);
    const token = await linkTokenRepo.findByToken(linkToken);

    if (!token) { throw new BadRequestError('Link token is not valid'); }
    if (token.authAccount.user) { throw new BadRequestError('Account is already registered'); }

    const authAccountRepo = getCustomRepository(AuthAccountRepository);
    const authAccount = await authAccountRepo.linkAuthAccountToUser(token.authAccount, user);

    await linkTokenRepo.deleteToken(token);

    return authAccount;
  });
}

/**
 * Gets all the auth accounts linked to the given user
 * @param user The user
 * @returns A list of auth accounts
 */
export async function getLinkedAccounts(user: User) {
  const authAccountRepo = getCustomRepository(AuthAccountRepository);
  return authAccountRepo.findAllAuthAccountsOfUser(user);
}

/**
 * Removes an account from a user
 * @param id The id of the account to unlink
 * @param user Thw user who wants to unlink the account
 * @returns The removed account
 */
export async function unlinkAccount(id: string, user: User) {
  const authAccountRepo = getCustomRepository(AuthAccountRepository);
  return authAccountRepo.unlinkAccount(id, user);
}
