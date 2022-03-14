import {
  Router, Request, Response, NextFunction,
} from 'express';
import { param, query } from 'express-validator';
import { NotImplementedError } from '../errors/httpstatus';

export enum MediaProvider {
  Spotify = 'spotify',
  YouTube = 'youtube',
  SoundCloud = 'soundcloud',
}

interface PaginationParams {
  page: number;
}

interface SearchParams extends Partial<PaginationParams> {
  q: string;
}

interface TrackSearchParams extends SearchParams {
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

export abstract class ExternalAPI {
  router: Router;

  constructor() {
    this.router = Router();

    this.router.get(
      '/tracks',
      query('q').isString().notEmpty(),
      query('page').isNumeric().optional().default(0),
      async (req: Request, res: Response, next: NextFunction) => {
        await this.handleSearchTracks(req, res, next);
      },
    );

    this.router.get(
      '/tracks/:id',
      param('id').isString(),
      async (req: Request, res: Response, next: NextFunction) => {
        await this.handleGetTrack(req, res, next);
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
    const { q, page } = request.query;
    const params = {
      q: q as string,
      page: Number(page),
    } as TrackSearchParams;

    const results = await this.searchTracks(params);
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

    const result = await this.getTrack(id);
    response.send(result);
  }

  /**
   * Finds a list of tracks from the external API based on the search params.
   * @param params The search params to use for finding the tracks
   * @returns A list of found tracks
   */
  async searchTracks(params: TrackSearchParams): Promise<ExternalTrack[]> {
    return [];
  }

  /**
   * Finds a single track from the API based on its ID from that API
   * @param id The id of the track to find
   */
  async getTrack(id: string): Promise<ExternalTrack> {
    throw new NotImplementedError();
  }
}
