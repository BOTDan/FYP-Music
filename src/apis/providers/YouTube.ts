import { google, youtube_v3 } from 'googleapis';
import { duration } from 'moment';
import { getCustomRepository } from 'typeorm';
import { config } from '../../config';
import { AuthAccount, AuthProvider } from '../../entities/AuthAccount';
import { User } from '../../entities/User';
import { ItemNotFoundError } from '../../errors/api';
import { AuthAccountRepository } from '../../repositories/AuthAccountRepository';
import {
  ExternalAPI, ExternalTrack, MediaProvider, TrackSearchParams,
} from './base';

const api = google.youtube('v3');
const apiKey = config.YOUTUBE_API_KEY;

export class YouTubeAPI extends ExternalAPI {
  /**
   * Formats data from the YouTube video API to our own internal format
   * @param video The video data to format
   * @returns The video in our own standard format
   */
  formatTrack(video: youtube_v3.Schema$Video) {
    const data = {
      provider: MediaProvider.YouTube,
      providerId: video.id,
      name: video.snippet?.title,
      artists: [
        {
          provider: MediaProvider.YouTube,
          providerId: video.snippet?.channelId,
          name: video.snippet?.channelTitle,
        },
      ],
      duration: duration(video.contentDetails?.duration).asMilliseconds(),
      image: video.snippet?.thumbnails?.default?.url,
    } as ExternalTrack;
    return data;
  }

  /**
   * Tries to find a YouTube account attached to this User
   * @param user The user to find the auth account of
   * @returns The auth account for this user
   */
  async getUserAuthAccount(user: User) {
    const authRepo = getCustomRepository(AuthAccountRepository);
    const authAccount = await authRepo.findAuthAccountOfUser(user, AuthProvider.Google);
    return authAccount;
  }

  /**
   * Attepts to find an auth account for a user, returns null if unable
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
   * Returns auth params for a YouTube query, preferring the auth account if available.
   * @param authAccount The auth account to use
   * @returns Params for a YouTube query
   */
  makeAuthParam(authAccount?: AuthAccount) {
    if (authAccount) {
      return { access_token: authAccount.accessToken };
    }
    return { key: apiKey };
  }

  async getTrack(id: string, user?: User): Promise<ExternalTrack> {
    const result = await this.getTracks([id], user);
    if (result.length !== 1) {
      throw new ItemNotFoundError('Track');
    }
    return result[0];
  }

  async getTracks(ids: string[], user?: User): Promise<ExternalTrack[]> {
    const authAccount = await this.tryGetUserAuthAccount(user);
    const authParam = this.makeAuthParam(authAccount);
    const result = await api.videos.list({
      part: ['snippet', 'contentDetails'],
      id: ids,
      ...authParam,
    });
    if (result.data.items && result.data.items.length > 0) {
      return result.data.items.map((video) => this.formatTrack(video));
    }
    return [];
  }

  async searchTracks(params: TrackSearchParams, user?: User): Promise<ExternalTrack[]> {
    const authAccount = await this.tryGetUserAuthAccount(user);
    const authParam = this.makeAuthParam(authAccount);
    const result = await api.search.list({
      part: ['snippet'],
      q: params.q,
      maxResults: 10,
      ...authParam,
    });
    if (result.data.items && result.data.items.length > 0) {
      const ids = result.data.items.map((video) => video.id?.videoId as string);
      return this.getTracks(ids, user);
    }
    return [];
  }
}
