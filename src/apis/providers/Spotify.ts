import SpotifyWebApi from 'spotify-web-api-node';
import { config } from '../../config';
import { AuthProvider } from '../../entities/AuthAccount';
import { User } from '../../entities/User';
import { ItemNotFoundError } from '../../errors/api';
import {
  ExternalAPI, ExternalArtist, ExternalTrack, MediaProvider, TrackSearchParams,
} from './base';

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
      image: track.album.images[0].url,
    } as ExternalTrack;
    return data;
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
