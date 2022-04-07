import { google, youtube_v3 } from 'googleapis';
import { duration } from 'moment';
import { config } from '../../config';
import { AuthAccount, AuthProvider } from '../../entities/AuthAccount';
import { User } from '../../entities/User';
import { ItemNotFoundError } from '../../errors/api';
import {
  ExternalAPI, ExternalPlaylist, ExternalTrack, MediaProvider, SearchParams, TrackSearchParams,
} from './base';

const api = google.youtube('v3');
const apiKey = config.YOUTUBE_API_KEY;

export class YouTubeAPI extends ExternalAPI {
  name = 'YouTube';
  authProvider = AuthProvider.Google;

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

  formatPlaylist(playlist: youtube_v3.Schema$SearchResult) {
    return {
      provider: MediaProvider.YouTube,
      providerId: playlist.id?.playlistId,
      name: playlist.snippet?.title,
      description: playlist.snippet?.description,
      image: playlist.snippet?.thumbnails?.default?.url,
    } as ExternalPlaylist;
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
      type: ['video'],
      ...authParam,
    });
    if (result.data.items && result.data.items.length > 0) {
      const ids = result.data.items.map((video) => video.id?.videoId as string);
      return this.getTracks(ids, user);
    }
    return [];
  }

  async searchPlaylists(params: SearchParams, user?: User): Promise<ExternalPlaylist[]> {
    const authAccount = await this.tryGetUserAuthAccount(user);
    const authParam = this.makeAuthParam(authAccount);
    const result = await api.search.list({
      part: ['snippet'],
      q: params.q,
      maxResults: 10,
      type: ['playlist'],
      ...authParam,
    });
    if (result.data.items && result.data.items.length > 0) {
      const playlists = result.data.items.map((playlist) => this.formatPlaylist(playlist));
      return playlists;
    }
    return [];
  }
}
