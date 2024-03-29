import SpotifyWebApi from 'spotify-web-api-node';
import spotifyAuthProvider from '../../auth/providers/Spotify';
import { config } from '../../config';
import { AuthAccount } from '../../entities/AuthAccount';
import { User } from '../../entities/User';
import { ItemNotFoundError } from '../../errors/api';
import {
  AuthProvider,
  ExternalArtist, ExternalPlaylist, ExternalTrack, MediaProvider, PaginationParams,
  SearchParams, TrackSearchParams,
} from '../../types/public';
import { ExternalAPI } from './base';

const api = new SpotifyWebApi({
  clientId: config.SPOTIFY_CLIENT_ID,
  clientSecret: config.SPOTIFY_CLIENT_SECRET,
});

export class SpotifyAPI extends ExternalAPI {
  name = 'Spotify';
  authProvider = AuthProvider.Spotify;

  formatArtist(artist: SpotifyApi.ArtistObjectSimplified) {
    const data = {
      provider: MediaProvider.Spotify,
      providerId: artist.id,
      name: artist.name,
    } as ExternalArtist;
    return data;
  }

  formatTrack(track: SpotifyApi.TrackObjectFull) {
    const data = {
      provider: MediaProvider.Spotify,
      providerId: track.id,
      name: track.name,
      artists: track.artists.map((artist) => this.formatArtist(artist)),
      duration: track.duration_ms,
      image: track.album.images[0]?.url,
    } as ExternalTrack;
    return data;
  }

  formatPlaylist(playlist: SpotifyApi.PlaylistObjectSimplified) {
    return {
      provider: MediaProvider.Spotify,
      providerId: playlist.id,
      name: playlist.name,
      description: playlist.description,
      image: playlist.images[0]?.url,
    } as ExternalPlaylist;
  }

  /**
   * Runs a spotify API function as the given auth user.
   * Refreshes their access token if needed.
   * @param authAccount The auth account to run as
   * @param fn The spotify API function to run
   * @returns The result from the API function
   */
  private async runAsAuthAccount<T extends (
    ...args: any) => any>(
    authAccount: AuthAccount,
    fn: T,
  )
    : Promise<ReturnType<T>> {
    try {
      api.setAccessToken(authAccount.accessToken!);
      const result = await fn();
      return result;
    } catch (e: any) {
      if (e.statusCode === 401) {
        await spotifyAuthProvider.refreshTokens(authAccount);
        api.setAccessToken(authAccount.accessToken!);
        const result = await fn();
        return result;
      }
    } finally {
      api.resetAccessToken();
    }
    throw new Error('Could not run as auth user');
  }

  async getTrack(id: string, user?: User): Promise<ExternalTrack> {
    const result = await this.getTracks([id], user);
    if (result.length !== 1) {
      throw new ItemNotFoundError('Track');
    }
    return result[0];
  }

  async getTracks(ids: string[], user?: User): Promise<ExternalTrack[]> {
    const authAccount = await this.requireAuthAccount(user);
    const result = await this.runAsAuthAccount(
      authAccount,
      () => api.getTracks(ids),
    );
    if (result.body && result.body.tracks) {
      return result.body.tracks.map((track) => this.formatTrack(track));
    }
    return [];
  }

  async searchTracks(params: TrackSearchParams, user?: User): Promise<ExternalTrack[]> {
    const authAccount = await this.requireAuthAccount(user);
    const results = await this.runAsAuthAccount(
      authAccount,
      () => api.searchTracks(params.q),
    );
    if (results.body && results.body.tracks) {
      return results.body.tracks.items.map((track) => this.formatTrack(track));
    }
    return [];
  }

  async getPlaylistTracks(id: string, user?: User): Promise<ExternalTrack[]> {
    const authAccount = await this.requireAuthAccount(user);
    const result = await this.runAsAuthAccount(
      authAccount,
      () => api.getPlaylistTracks(id),
    );
    if (result.body && result.body.items) {
      return result.body.items.map((track) => this.formatTrack(track.track));
    }
    return [];
  }

  async getPlaylist(id: string, user?: User): Promise<ExternalPlaylist> {
    const authAccount = await this.requireAuthAccount(user);
    const result = await this.runAsAuthAccount(
      authAccount,
      () => api.getPlaylist(id),
    );
    if (result.body) {
      const playlist = await this.formatPlaylist(result.body);
      playlist.tracks = await this.getPlaylistTracks(id, user);
      return playlist;
    }
    throw new ItemNotFoundError('Playlist');
  }

  async searchPlaylists(params: SearchParams, user?: User): Promise<ExternalPlaylist[]> {
    const authAccount = await this.requireAuthAccount(user);
    const result = await this.runAsAuthAccount(authAccount, () => api.searchPlaylists(params.q));
    if (result.body && result.body.playlists) {
      return result.body.playlists.items.map((playlist) => this.formatPlaylist(playlist));
    }
    return [];
  }

  async getMyPlaylists(params: PaginationParams, user: User): Promise<ExternalPlaylist[]> {
    const authAccount = await this.requireAuthAccount(user);
    const result = await this.runAsAuthAccount(
      authAccount,
      () => api.getUserPlaylists({ limit: 50 }),
    );
    if (result && result.body && result.body.items) {
      return result.body.items.map((playlist) => this.formatPlaylist(playlist));
    }
    return [];
  }

  async playTrack(id: string, device?: string, user?: User): Promise<void> {
    const authAccount = await this.requireAuthAccount(user);
    await this.runAsAuthAccount(
      authAccount,
      () => api.play({ uris: [`spotify:track:${id}`], device_id: device ?? '' }),
    );
  }
}

const spotifyAPI = new SpotifyAPI();
export default spotifyAPI;
