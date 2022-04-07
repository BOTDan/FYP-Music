import {
  Router, Request, Response, NextFunction,
} from 'express';
import { param, query, validationResult } from 'express-validator';
import { getCustomRepository } from 'typeorm';
import { preferAuthentication } from '../../auth';
import { AuthProvider } from '../../entities/AuthAccount';
import { User } from '../../entities/User';
import { BadRequestValidationError } from '../../errors/api';
import { InternalServerError, NotAuthenticatedError, UnauthorizedError } from '../../errors/httpstatus';
import { AuthAccountRepository } from '../../repositories/AuthAccountRepository';

export enum MediaProvider {
  Spotify = 'spotify',
  YouTube = 'youtube',
  SoundCloud = 'soundcloud',
}

export interface PaginationParams {
  page: number;
}

export interface SearchParams extends Partial<PaginationParams> {
  q: string;
}

export interface TrackSearchParams extends SearchParams {
  //
}

export interface ExternalArtist {
  name: string;
  image?: string;
  provider: MediaProvider;
  providerId: string;
}

export interface ExternalTrack {
  name: string;
  duration: number;
  artists: ExternalArtist[];
  image?: string;
  provider: MediaProvider;
  providerId: string;
}

/**
 * Represents an external music API.
 * Responsible for most data returned to the user
 */
export abstract class ExternalAPI {
  router: Router;
  name: string = 'Misconfigured';
  authProvider: AuthProvider | null = null;

  constructor() {
    this.router = Router();

    this.router.get(
      '/tracks',
      preferAuthentication,
      query('q').isString(),
      query('page').isNumeric().optional().default(0),
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const errors = validationResult(req);
          if (!errors.isEmpty()) {
            throw new BadRequestValidationError(errors.array());
          }
          await this.handleSearchTracks(req, res, next);
        } catch (e) {
          next(e);
        }
      },
    );

    this.router.get(
      '/tracks/:id',
      preferAuthentication,
      param('id').isString(),
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const errors = validationResult(req);
          if (!errors.isEmpty()) {
            throw new BadRequestValidationError(errors.array());
          }
          await this.handleGetTrack(req, res, next);
        } catch (e) {
          next(e);
        }
      },
    );
  }

  /**
   * Tries to find a Spotify account attached to this User
   * @param user The user to find the auth account of
   * @returns The auth account for this user
   */
  async getUserAuthAccount(user: User) {
    if (!this.authProvider) { throw new Error('API not configured to require authentication'); }
    const authRepo = getCustomRepository(AuthAccountRepository);
    const authAccount = await authRepo.findAuthAccountOfUser(user, this.authProvider);
    return authAccount;
  }

  /**
   * Attepts to find an auth account for a user, returns undefined if unable
   * @param user The user to find the auth account of
   * @returns An auth acount if found
   */
  async tryGetUserAuthAccount(user?: User) {
    if (!user) { return undefined; }
    try {
      return await this.getUserAuthAccount(user);
    } catch (e) {
      return undefined;
    }
  }

  /**
   * Helper function to return appropriate errors for attempting to get an auth account for the user
   * @param user The user to find the auth account of
   * @returns The auth account for this user, with access token
   */
  async requireAuthAccount(user?: User) {
    if (!user) {
      throw new NotAuthenticatedError(`${this.name} API requires you to be signed in`);
    }
    const authAccount = await this.getUserAuthAccount(user);
    if (!authAccount) {
      throw new UnauthorizedError(`A ${this.authProvider} account must be linked to this account to use the Spotify API`);
    }
    if (!authAccount.accessToken) {
      throw new InternalServerError(`${this.authProvider} account missing access tokens. Log in again.`);
    }
    return authAccount;
  }

  /**
   * Handles GET requests to {provider}/tracks
   * Should return a list of track objects, if possible
   * @param request Express request object
   * @param response Express response object
   * @param next Express next function
   */
  async handleSearchTracks(request: Request, response: Response, next: NextFunction) {
    try {
      const { q, page } = request.query;
      const params = {
        q: q as string,
        page: Number(page),
      } as TrackSearchParams;
      const user = request.token?.user;

      const results = await this.searchTracks(params, user);
      response.send(results);
    } catch (e) {
      next(e);
    }
  }

  /**
   * Handles GET requests to {provider}/tracks/id
   * Should return a track object if possible
   * @param request Express request object
   * @param response Express response object
   * @param next Express next function
   */
  async handleGetTrack(request: Request, response: Response, next: NextFunction) {
    try {
      const { id } = request.params;
      const user = request.token?.user;

      const result = await this.getTrack(id, user);
      response.send(result);
    } catch (e) {
      next(e);
    }
  }

  /**
   * Finds a list of tracks from the external API based on the search params.
   * @param params The search params to use for finding the tracks
   * @returns A list of found tracks
   */
  abstract searchTracks(params: TrackSearchParams, user?: User): Promise<ExternalTrack[]>;

  /**
   * Finds a single track from the API based on its ID from that API
   * @param id The id of the track to find
   */
  abstract getTrack(id: string, user?: User): Promise<ExternalTrack>;

  /**
   * Finds a list of tracks from the API based on its ID from that API
   * @param ids The id of the tracks to find
   */
  abstract getTracks(ids: string[], user?: User): Promise<ExternalTrack[]>;
}
