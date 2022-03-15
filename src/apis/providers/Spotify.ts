import SpotifyWebApi from 'spotify-web-api-node';
import { getCustomRepository } from 'typeorm';
import { config } from '../../config';
import { AuthProvider } from '../../entities/AuthAccount';
import { User } from '../../entities/User';
import { ItemNotFoundError } from '../../errors/api';
import { InternalServerError, NotAuthenticatedError, UnauthorizedError } from '../../errors/httpstatus';
import { AuthAccountRepository } from '../../repositories/AuthAccountRepository';
import {
  ExternalAPI, ExternalArtist, ExternalTrack, MediaProvider, TrackSearchParams,
} from './base';

const api = new SpotifyWebApi({
  clientId: config.SPOTIFY_CLIENT_ID,
  clientSecret: config.SPOTIFY_CLIENT_SECRET,
});

export class SpotifyAPI extends ExternalAPI {
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
      image: track.album.images[0].url,
    } as ExternalTrack;
    return data;
  }

  /**
   * Tries to find a Spotify account attached to this User
   * @param user The user to find the auth account of
   * @returns The auth account for this user
   */
  async getUserAuthAccount(user: User) {
    const authRepo = getCustomRepository(AuthAccountRepository);
    const authAccount = await authRepo.findAuthAccountOfUser(user, AuthProvider.Spotify);
    return authAccount;
  }

  /**
   * Helper function to return appropriate errors for attempting to get an auth account for the user
   * @param user The user to find the auth account of
   * @returns The auth account for this user, with access token
   */
  async requireAuthAccount(user?: User) {
    if (!user) {
      throw new NotAuthenticatedError('Spotify API requires you to be signed in');
    }
    const authAccount = await this.getUserAuthAccount(user);
    if (!authAccount) {
      throw new UnauthorizedError('A Spotify account must be linked to this account to use the Spotify API');
    }
    if (!authAccount.accessToken) {
      throw new InternalServerError('Spotify account missing access tokens. Log in again.');
    }
    return authAccount;
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
    try {
      api.setAccessToken(authAccount.accessToken!);
      const result = await api.getTracks(ids);
      if (result.body && result.body.tracks) {
        return result.body.tracks.map((track) => this.formatTrack(track));
      }
    } finally {
      api.resetAccessToken();
    }
    return [];
  }

  async searchTracks(params: TrackSearchParams, user?: User): Promise<ExternalTrack[]> {
    const authAccount = await this.requireAuthAccount(user);
    try {
      api.setAccessToken(authAccount.accessToken!);
      const results = await api.searchTracks(params.q);
      if (results.body && results.body.tracks) {
        return results.body.tracks.items.map((track) => this.formatTrack(track));
      }
    } finally {
      api.resetAccessToken();
    }
    return [];
  }
}
