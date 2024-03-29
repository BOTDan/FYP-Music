import {
  Router, Request, Response, NextFunction,
} from 'express';
import { param, query, validationResult } from 'express-validator';
import { getCustomRepository } from 'typeorm';
import { preferAuthentication, requireAuthentication } from '../../auth';
import { User } from '../../entities/User';
import { BadRequestValidationError } from '../../errors/api';
import { InternalServerError, NotAuthenticatedError, UnauthorizedError } from '../../errors/httpstatus';
import { AuthAccountRepository } from '../../repositories/AuthAccountRepository';
import {
  AuthProvider,
  ExternalPlaylist, ExternalTrack, PaginationParams, SearchParams, TrackSearchParams,
} from '../../types/public';

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
      this.ensureValidRequest,
      async (req: Request, res: Response, next: NextFunction) => {
        try {
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
      this.ensureValidRequest,
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          await this.handleGetTrack(req, res, next);
        } catch (e) {
          next(e);
        }
      },
    );

    this.router.get(
      '/playlists',
      preferAuthentication,
      query('q').isString(),
      query('page').isNumeric().optional().default(0),
      this.ensureValidRequest,
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          await this.handleSearchPlaylists(req, res, next);
        } catch (e) {
          next(e);
        }
      },
    );

    this.router.get(
      '/playlists/:id',
      preferAuthentication,
      param('id').isString(),
      this.ensureValidRequest,
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          await this.handleGetPlaylist(req, res, next);
        } catch (e) {
          next(e);
        }
      },
    );

    this.router.get(
      '/me/playlists',
      requireAuthentication,
      query('page').isNumeric().optional().default(0),
      this.ensureValidRequest,
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          await this.handleGetMyPlaylists(req, res, next);
        } catch (e) {
          next(e);
        }
      },
    );

    this.router.post(
      '/me/play/:id',
      requireAuthentication,
      param('id').isString(),
      query('device').optional().isString(),
      this.ensureValidRequest,
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          await this.handlePlayTrack(req, res, next);
        } catch (e) {
          next(e);
        }
      },
    );
  }

  /**
   * Middleware function to return an error to the user if their request is invalid
   * @param request Express request object
   * @param response Express response object
   * @param next Express next function
   */
  ensureValidRequest(request: Request, response: Response, next: NextFunction) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      next(new BadRequestValidationError(errors.array()));
    } else {
      next();
    }
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
    const { q, page } = request.query;
    const params = {
      q: q as string,
      page: Number(page),
    } as TrackSearchParams;
    const user = request.token?.user;

    const results = await this.searchTracks(params, user);
    response.send(results);
  }

  /**
   * Handles GET requests to {provider}/tracks/id
   * Should return a track object if possible
   * @param request Express request object
   * @param response Express response object
   * @param next Express next function
   */
  async handleGetTrack(request: Request, response: Response, next: NextFunction) {
    const { id } = request.params;
    const user = request.token?.user;

    const result = await this.getTrack(id, user);
    response.send(result);
  }

  async handleSearchPlaylists(request: Request, response: Response, next: NextFunction) {
    const { q, page } = request.query;
    const params = {
      q: q as string,
      page: Number(page),
    } as TrackSearchParams;
    const user = request.token?.user;

    const results = await this.searchPlaylists(params, user);
    response.send(results);
  }

  async handleGetMyPlaylists(request: Request, response: Response, next: NextFunction) {
    const { page } = request.query;
    const params = {
      page: Number(page),
    } as PaginationParams;

    const user = request.token?.user;
    if (!user) {
      throw new NotAuthenticatedError();
    }

    const results = await this.getMyPlaylists(params, user);
    response.send(results);
  }

  async handleGetPlaylist(request: Request, response: Response, next: NextFunction) {
    const { id } = request.params;
    const user = request.token?.user;

    const result = await this.getPlaylist(id, user);
    response.send(result);
  }

  async handlePlayTrack(request: Request, response: Response, next: NextFunction) {
    const { id } = request.params;
    const { device } = request.query;
    const user = request.token?.user;

    await this.playTrack(id, device?.toString(), user);
    response.sendStatus(204);
  }

  /**
   * Finds a list of tracks from the external API based on the search params.
   * @param params The search params to use for finding the tracks
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

  /**
   * Finds a list of playlists from the external API.
   * @param params The search params for finding the playlist
   * @param user The user that made the request, if available
   */
  abstract searchPlaylists(params: SearchParams, user?: User): Promise<ExternalPlaylist[]>;

  /**
   * Finds a users playlists from their main account.
   * @param params The pagination params
   * @param user The user that made the request. Will be available here
   */
  abstract getMyPlaylists(params: PaginationParams, user: User): Promise<ExternalPlaylist[]>;

  /**
   * Finds a playlist's tracks'
   * @param ids The id of the playlist to find
   * @param user The user that made the request, if available
   */
  abstract getPlaylistTracks(id: string, user?: User): Promise<ExternalTrack[]>;

  /**
   * Finds a playlist. Includes its tracks
   * @param id The id of the playlist to find
   * @param user The user that made the request, if available
   */
  abstract getPlaylist(id: string, user?: User): Promise<ExternalPlaylist>;

  /**
   * Plays a song for the user
   * @param id The id of the track to play
   * @param user The user trying to play the track
   */
  abstract playTrack(id: string, device?: string, user?: User): Promise<void>;
}
