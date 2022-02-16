import {
  NextFunction, Request, Response, Router,
} from 'express';
import { Profile } from 'passport';
import { VerifyCallback } from 'passport-google-oauth20';
import { getConnection, getCustomRepository } from 'typeorm';
import { issueToken } from '..';
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
 * Information about a 3rd party login attempt
 */
export interface AuthInfo {
  provider: AuthProvider,
  id: string,
  tokens: {
    accessToken: string,
    refreshToken: string,
  },
  userInfo: AuthUserInfo,
}

export class BaseAuthProvider {
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
  handleLoginRequest(request: Request, response: Response, next: NextFunction) {
    next();
  }

  /**
   * Handles GET requests to /login/callback.
   * Should add auth information to the request object so the request can be handled after.
   * @param request Express request object
   * @param response Express response object
   * @param next Express next function
   */
  handleLoginCallback(request: Request, response: Response, next: NextFunction) {
    next();
  }

  /**
   * Handles GET reuqests to /link
   * Should redirect the user to 3rd party login screen
   * @param request Express request object
   * @param response Express response object
   * @param next Express next function
   */
  handleLinkRequest(request: Request, response: Response, next: NextFunction) {
    next();
  }

  /**
   * Handles GET requests to /link/callback.
   * Should add auth information to the request object so the request can be handled after.
   * @param request Express request object
   * @param response Express response object
   * @param next Express next function
   */
  handleLinkCallback(request: Request, response: Response, next: NextFunction) {
    next();
  }

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
    const authAccount = await this.findAuthAccount(id);

    if (authAccount) {
      // Log user in and return a token
      if (authAccount.user) {
        // Auth account linked to a user
        const token = await this.issueToken(authAccount.user);
        response.send(token);
      } else {
        // Auth account is not linked to a user
        const user = await this.createUser(authAccount, userInfo.displayName);
        const token = await this.issueToken(user);
        response.send(token);
      }
    } else {
      // Create a new account
      const user = await this.createUser(id, userInfo.displayName);
      const token = await this.issueToken(user);
      response.send(token);
    }
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
    const authAccount = await this.findAuthAccount(id);

    if (authAccount) {
      // Auth account is already registered with us in some way
      if (authAccount.user) {
        // Account already linked to a user, so can't be linked again
        next(new BadRequestError('Account is already linked to a user'));
      } else {
        // Account isn't linked, give a token to allow linking
        const linkToken = await this.issueLinkToken(authAccount);
        response.send(linkToken);
      }
    } else {
      // Auth account unregistered, register it and create link token
      const linkToken = await this.issueLinkToken(id);
      response.send(linkToken);
    }
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
   * @returns A user, if created
   */
  async createUser(account: AuthAccount | string, displayName: string) {
    const connection = getConnection();
    return connection.transaction(async (entityManager) => {
      const userRepo = entityManager.getCustomRepository(UserRepository);
      const user = await userRepo.createUser(displayName);

      const authRepo = entityManager.getCustomRepository(AuthAccountRepository);
      if (account instanceof AuthAccount) {
        await authRepo.linkAuthAccountToUser(account, user);
      } else {
        await authRepo.createAuthAccount(this.provider, account, user);
      }

      return user;
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
      return linkTokenRepo.createToken(account);
    }
    const connection = getConnection();
    return connection.transaction(async (entityManager) => {
      const authRepo = entityManager.getCustomRepository(AuthAccountRepository);
      const authAccount = await authRepo.createAuthAccount(this.provider, account);

      const linkTokenRepo = entityManager.getCustomRepository(AuthAccountLinkTokenRepository);
      const linkToken = await linkTokenRepo.createToken(authAccount);

      return linkToken;
    });
  }

  /**
   * Extracts the necessary user information from a passport user object
   * @param profile The profile returned from Passport
   * @returns The info from the profile
   */
  extractUserInfo(profile: Profile): AuthUserInfo {
    return {
      id: profile.id,
      displayName: profile.displayName,
    };
  }

  /**
   * Processes user information after they've completed oauth login
   * @param request The Express request object
   * @param accessToken The access token from oauth
   * @param refreshToken The refresh token from oauth
   * @param profile User information
   * @param done Callback function
   */
  processAuthInfo(
    request: Request,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    const userInfo = this.extractUserInfo(profile);
    const tokens = { accessToken, refreshToken };
    const info = {
      provider: this.provider,
      id: userInfo.id,
      tokens,
      userInfo,
    } as AuthInfo;
    done(null, userInfo, info);
  }
}
