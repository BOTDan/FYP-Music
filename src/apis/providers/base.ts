import {
  Router, Request, Response, NextFunction,
} from 'express';
import { param, query, validationResult } from 'express-validator';
import { preferAuthentication } from '../../auth';
import { BadRequestValidationError } from '../../errors/api';

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

      const results = await this.searchTracks(params);
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

      const result = await this.getTrack(id);
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
  abstract searchTracks(params: TrackSearchParams): Promise<ExternalTrack[]>;

  /**
   * Finds a single track from the API based on its ID from that API
   * @param id The id of the track to find
   */
  abstract getTrack(id: string): Promise<ExternalTrack>;

  /**
   * Finds a list of tracks from the API based on its ID from that API
   * @param ids The id of the tracks to find
   */
  abstract getTracks(ids: string[]): Promise<ExternalTrack[]>;
}
