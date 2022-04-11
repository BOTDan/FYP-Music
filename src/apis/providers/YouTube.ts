import { google, youtube_v3 } from 'googleapis';
import { duration } from 'moment';
import googleAuthProvider from '../../auth/providers/Google2';
import { config } from '../../config';
import { AuthAccount, AuthProvider } from '../../entities/AuthAccount';
import { User } from '../../entities/User';
import { ItemNotFoundError } from '../../errors/api';
import {
  ExternalAPI, ExternalPlaylist, ExternalTrack, MediaProvider, PaginationParams, SearchParams,
  TrackSearchParams,
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

  formatPlaylist(playlist: youtube_v3.Schema$SearchResult | youtube_v3.Schema$Playlist) {
    if (typeof playlist.id === 'string') {
      const playlistTyped = playlist as youtube_v3.Schema$Playlist;
      const formatted: ExternalPlaylist = {
        provider: MediaProvider.YouTube,
        providerId: playlistTyped.id ?? '',
        name: playlistTyped.snippet?.title ?? '',
        description: playlistTyped.snippet?.description ?? '',
        image: playlistTyped.snippet?.thumbnails?.default?.url ?? '',
      };
      return formatted;
    }
    const playlistTyped = playlist as youtube_v3.Schema$SearchResult;
    const formatted: ExternalPlaylist = {
      provider: MediaProvider.YouTube,
      providerId: playlistTyped.id?.playlistId ?? '',
      name: playlistTyped.snippet?.title ?? '',
      description: playlistTyped.snippet?.description ?? '',
      image: playlistTyped.snippet?.thumbnails?.default?.url ?? '',
    };
    return formatted;
  }

  /**
   * Runs a youtube API function as the given auth user.
   * Refreshes their access token if needed.
   * @param authAccount The auth account to run as
   * @param fn The spotify API function to run
   * @returns The result from the API function
   */
  private async runAsAuthAccount<T extends (
    ...args: any) => any>(
    authAccount: AuthAccount | undefined,
    fn: T,
  )
    : Promise<ReturnType<T>> {
    try {
      const auth = this.makeAuthParam(authAccount);
      const result = await fn(auth);
      return result;
    } catch (e: any) {
      if (e.code === 401 && authAccount) {
        await googleAuthProvider.refreshTokens(authAccount);
        const auth = this.makeAuthParam(authAccount);
        const result = await fn(auth);
        return result;
      }
    }
    throw new Error('Could not run as auth user');
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
    const result = await this.runAsAuthAccount(
      authAccount,
      (authParam) => api.videos.list({
        part: ['snippet', 'contentDetails'],
        id: ids,
        ...authParam,
      }),
    );
    if (result.data.items && result.data.items.length > 0) {
      return result.data.items.map((video) => this.formatTrack(video));
    }
    return [];
  }

  async searchTracks(params: TrackSearchParams, user?: User): Promise<ExternalTrack[]> {
    const authAccount = await this.tryGetUserAuthAccount(user);
    const result = await this.runAsAuthAccount(
      authAccount,
      (authParam) => api.search.list({
        part: ['snippet'],
        q: params.q,
        maxResults: 10,
        type: ['video'],
        ...authParam,
      }),
    );
    if (result.data.items && result.data.items.length > 0) {
      const ids = result.data.items.map((video) => video.id?.videoId as string);
      return this.getTracks(ids, user);
    }
    return [];
  }

  async getPlaylistTracks(id: string, user?: User): Promise<ExternalTrack[]> {
    const authAccount = await this.tryGetUserAuthAccount(user);
    const result = await this.runAsAuthAccount(
      authAccount,
      (authParam) => api.playlistItems.list({
        part: ['snippet', 'contentDetails'],
        playlistId: id,
        maxResults: 50,
        ...authParam,
      }),
    );
    if (result.data.items && result.data.items.length > 0) {
      const ids = result.data.items.map((item) => item.contentDetails?.videoId ?? '');
      return this.getTracks(ids, user);
    }
    return [];
  }

  async getPlaylist(id: string, user?: User): Promise<ExternalPlaylist> {
    const authAccount = await this.tryGetUserAuthAccount(user);
    const result = await this.runAsAuthAccount(
      authAccount,
      (authParam) => api.playlists.list({
        part: ['snippet', 'contentDetails'],
        id,
        maxResults: 1,
        ...authParam,
      }),
    );
    if (result.data.items && result.data.items.length > 0) {
      const playlist = this.formatPlaylist(result.data.items[0]);
      playlist.tracks = await this.getPlaylistTracks(id, user);
      return playlist;
    }
    throw new ItemNotFoundError('Playlist');
  }

  async searchPlaylists(params: SearchParams, user?: User): Promise<ExternalPlaylist[]> {
    const authAccount = await this.tryGetUserAuthAccount(user);
    const result = await this.runAsAuthAccount(
      authAccount,
      (authParam) => api.search.list({
        part: ['snippet'],
        q: params.q,
        maxResults: 10,
        type: ['playlist'],
        ...authParam,
      }),
    );
    if (result.data.items && result.data.items.length > 0) {
      const playlists = result.data.items.map((playlist) => this.formatPlaylist(playlist));
      return playlists;
    }
    return [];
  }

  async getMyPlaylists(params: PaginationParams, user: User): Promise<ExternalPlaylist[]> {
    const authAccount = await this.tryGetUserAuthAccount(user);
    if (!authAccount) { throw new Error('No account for this user'); }
    const result = await this.runAsAuthAccount(
      authAccount,
      (authParam) => api.playlists.list({
        part: ['snippet', 'contentDetails'],
        maxResults: 50,
        mine: true,
        ...authParam,
      }),
    );
    if (result.data.items && result.data.items.length > 0) {
      const playlists = result.data.items.map((playlist) => this.formatPlaylist(playlist));
      return playlists;
    }
    return [];
  }
}

const youtubeAPI = new YouTubeAPI();
export default youtubeAPI;
