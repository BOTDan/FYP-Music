import {
  NextFunction, Request, Response, Router,
} from 'express';
import { getConnection, getCustomRepository } from 'typeorm';
import { issueToken, updateStoredTokens } from '..';
import { AuthAccount, AuthProvider } from '../../entities/AuthAccount';
import { User } from '../../entities/User';
import { BadRequestError, InternalServerError } from '../../errors/httpstatus';
import { AuthAccountLinkTokenRepository } from '../../repositories/AuthAccountLinkTokenRepository';
import { AuthAccountRepository } from '../../repositories/AuthAccountRepository';
import { UserRepository } from '../../repositories/UserRepository';

/**
 * User information returned from a 3rd party login attempt
 */
export interface AuthUserInfo {
  id: string;
  displayName: string;
}

/**
 * Store access and refresh tokens of external provider
 */
export interface AuthInfoTokens {
  accessToken: string,
  refreshToken?: string,
}

/**
 * Information about a 3rd party login attempt
 */
export interface AuthInfo {
  provider: AuthProvider,
  id: string,
  tokens: AuthInfoTokens,
  userInfo: AuthUserInfo,
}

export abstract class BaseAuthProvider {
  name: string = 'base';
  router: Router;
  provider: AuthProvider;

  /**
   * Creates a new auth provider.
   * Provides a router that can be used for authentication.
   * Should be extended.
   * @param name The name of the auth provider
   * @param provider The database provider type
   */
  constructor(name: string, provider: AuthProvider) {
    this.name = name ?? this.name;
    this.router = Router();
    this.provider = provider;

    this.router.get(
      '/login',
      (req, res, next) => { this.handleLoginRequest(req, res, next); },
    );
    this.router.get(
      '/login/callback',
      (req, res, next) => { this.handleLoginCallback(req, res, next); },
      (req, res, next) => { this.afterHandleLoginCallback(req, res, next); },
    );
    this.router.get(
      '/link',
      (req, res, next) => { this.handleLinkRequest(req, res, next); },
    );
    this.router.get(
      '/link/callback',
      (req, res, next) => { this.handleLinkCallback(req, res, next); },
      (req, res, next) => { this.afterHandleLinkCallback(req, res, next); },
    );
    this.router.get(
      '/callback',
      (req, res, next) => { this.handleCallback(req, res, next); },
    );
  }

  /**
   * Handles GET reuqests to /login
   * Should redirect the user to 3rd party login screen
   * @param request Express request object
   * @param response Express response object
   * @param next Express next function
   */
  abstract handleLoginRequest(request: Request, response: Response, next: NextFunction): void;

  /**
   * Handles GET requests to /login/callback.
   * Should add auth information to the request object so the request can be handled after.
   * @param request Express request object
   * @param response Express response object
   * @param next Express next function
   */
  abstract handleLoginCallback(request: Request, response: Response, next: NextFunction): void;

  /**
   * Handles GET reuqests to /link
   * Should redirect the user to 3rd party login screen
   * @param request Express request object
   * @param response Express response object
   * @param next Express next function
   */
  abstract handleLinkRequest(request: Request, response: Response, next: NextFunction): void;

  /**
   * Handles GET requests to /link/callback.
   * Should add auth information to the request object so the request can be handled after.
   * @param request Express request object
   * @param response Express response object
   * @param next Express next function
   */
  abstract handleLinkCallback(request: Request, response: Response, next: NextFunction): void;

  /**
   * Handles GET requests to /callabck. Farwards them on depending on state parameter.
   * @param request Express request object
   * @param response Express response object
   * @param next Express next function
   */
  private handleCallback(request: Request, response: Response, next: NextFunction) {
    if (request.query.state) {
      switch (request.query.state) {
        case 'login':
          request.url = '/login/callback';
          this.router(request, response, next);
          break;
        case 'link':
          request.url = '/link/callback';
          this.router(request, response, next);
          break;
        default:
          next(new BadRequestError('Query parameter state not recognised'));
      }
    } else {
      next(new BadRequestError('Query parameter state missing'));
    }
  }

  /**
   * Called after the request has had auth information added, handles issuing session tokens
   * @param request Express request object
   * @param response Express response object
   * @param next Express next function
   */
  async afterHandleLoginCallback(request: Request, response: Response, next: NextFunction) {
    if (!request.authInfo) { next(new InternalServerError('Auth information missing')); return; }
    if (request.authInfo.provider !== this.provider) { next(new InternalServerError('Auth provider mismatch')); return; }

    const { id } = request.authInfo;
    const { userInfo } = request.authInfo;
    let authAccount = await this.findAuthAccount(id);

    let user;
    if (authAccount) {
      // Log user in and return a token
      if (authAccount.user) {
        // Auth account linked to a user
        user = authAccount.user;
      } else {
        // Auth account is not linked to a user
        const createdUser = await this.createUser(authAccount, userInfo.displayName);
        user = createdUser.user;
      }
    } else {
      // Create a new account
      const createdUser = await this.createUser(id, userInfo.displayName);
      user = createdUser.user;
      authAccount = createdUser.authAccount;
    }
    const { tokens } = request.authInfo;
    await updateStoredTokens(authAccount, tokens.accessToken, tokens.refreshToken);
    const token = await this.issueToken(user);
    response.send({ token });
  }

  /**
   * Called after the request has had auth information added, handles issuing link tokens
   * @param request Express request object
   * @param response Express response object
   * @param next Express next function
   */
  private async afterHandleLinkCallback(request: Request, response: Response, next: NextFunction) {
    if (!request.authInfo) { next(new InternalServerError('Auth information missing')); return; }
    if (request.authInfo.provider !== this.provider) { next(new InternalServerError('Auth provider mismatch')); return; }

    const { id } = request.authInfo;
    let authAccount = await this.findAuthAccount(id);

    let linkToken;
    if (authAccount) {
      // Auth account is already registered with us in some way
      if (authAccount.user) {
        // Account already linked to a user, so can't be linked again
        next(new BadRequestError('Account is already linked to a user'));
      } else {
        // Account isn't linked, give a token to allow linking
        const createdToken = await this.issueLinkToken(authAccount);
        linkToken = createdToken.linkToken;
      }
    } else {
      // Auth account unregistered, register it and create link token
      const createdToken = await this.issueLinkToken(id);
      linkToken = createdToken.linkToken;
      authAccount = createdToken.authAccount;
    }
    const { tokens } = request.authInfo;
    await updateStoredTokens(authAccount, tokens.accessToken, tokens.refreshToken);
    response.send(linkToken);
  }

  /**
   * Overwriteable function to handle errors in the router
   * @param error The error
   * @param request The Express request
   * @param response The Express response
   * @param next The Express next function
   */
  handleError(error: Error | string, request: Request, response: Response, next: NextFunction) {
    next(error);
  }

  /**
   * Finds an auth account by ID in the database
   * @param id The 3rd party ID of the auth account
   * @returns An auth account, if found
   */
  async findAuthAccount(id: string) {
    const repo = getCustomRepository(AuthAccountRepository);
    return repo.findByAuthId(this.provider, id);
  }

  /**
   * Creates a new user linked to the given auth account or id
   * @param account The auth account, or ID of one to register
   * @param displayName The display name of the new user
   * @returns A user and the attached auth account, if created
   */
  async createUser(account: AuthAccount | string, displayName: string) {
    const connection = getConnection();
    return connection.transaction(async (entityManager) => {
      const userRepo = entityManager.getCustomRepository(UserRepository);
      const user = await userRepo.createUser(displayName);

      const authRepo = entityManager.getCustomRepository(AuthAccountRepository);
      let authAccount;
      if (account instanceof AuthAccount) {
        authAccount = account;
        await authRepo.linkAuthAccountToUser(account, user);
      } else {
        authAccount = await authRepo.createAuthAccount(this.provider, account, user);
      }

      return { user, authAccount };
    });
  }

  /**
   * Creates a session token for the given user
   * @param user The user
   * @returns A session token, if created
   */
  async issueToken(user: User) {
    return issueToken(user);
  }

  /**
   * Crteates a link token for the given account
   * @param account The account
   * @returns A link token, if created
   */
  async issueLinkToken(account: AuthAccount | string) {
    if (account instanceof AuthAccount) {
      const linkTokenRepo = getCustomRepository(AuthAccountLinkTokenRepository);
      const linkToken = await linkTokenRepo.createToken(account);
      return { linkToken, authAccount: account };
    }
    const connection = getConnection();
    return connection.transaction(async (entityManager) => {
      const authRepo = entityManager.getCustomRepository(AuthAccountRepository);
      const authAccount = await authRepo.createAuthAccount(this.provider, account);

      const linkTokenRepo = entityManager.getCustomRepository(AuthAccountLinkTokenRepository);
      const linkToken = await linkTokenRepo.createToken(authAccount);

      return { linkToken, authAccount };
    });
  }

  /**
   * Extracts the necessary user information from a passport user object
   * @param profile The profile returned from Passport
   * @returns The info from the profile
   */
  extractUserInfo(profile: any): AuthUserInfo {
    return {
      id: profile.id,
      displayName: profile.displayName,
    };
  }

  /**
   * Processes user information after they've completed oauth login
   * This should be overwritten by the provider and call done(
   *  null,
   *  AuthUserInfo,
   *  AuthInfo
   * );
   */
  // processAuthInfo(...args: any) {
  // Overwrite me
  // }

  async refreshTokens(authAccount: AuthAccount) {
    if (!authAccount.refreshToken) {
      throw new InternalServerError('Auth account has no refresh token');
    }
    const newTokens = await this.getNewTokens(authAccount.refreshToken);
    await updateStoredTokens(authAccount, newTokens.accessToken, newTokens.refreshToken);
    return newTokens;
  }

  abstract getNewTokens(refreshToken: string): Promise<AuthInfoTokens>;
}
