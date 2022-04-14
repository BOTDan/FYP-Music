import { authFetchCatchFail } from '.';
import {
  ExternalPlaylist, ExternalTrack, PlaylistDTO, MediaProvider, TrackOnPlaylistDTO,
  UserTokenDTO,
} from '../types/public';

/**
 * Queries the API to search for playlists
 * @param provider The media provider to use
 * @param token The user token
 * @returns A list of playlists
 */
export async function getProviderPlaylists(
  provider: MediaProvider,
  token: UserTokenDTO,
): Promise<ExternalPlaylist[]> {
  return authFetchCatchFail(`/api/${provider.toLowerCase()}/me/playlists`, token);
}

/**
 * Queries the API for a playlist
 * @param provider The media provider to use
 * @param id The id of the playlist
 * @param token The user token
 * @returns A playlist
 */
export async function getProviderPlaylist(
  provider: MediaProvider,
  id: string,
  token?: UserTokenDTO,
): Promise<ExternalPlaylist> {
  return authFetchCatchFail(`/api/${provider.toLowerCase()}/playlists/${encodeURIComponent(id)}`, token);
}

/**
 * Gets the users playlists
 * @param token The user token
 * @returns A list of owned playlists
 */
export async function getMyPlaylists(
  token: UserTokenDTO,
): Promise<PlaylistDTO[]> {
  return authFetchCatchFail('/api/me/playlists/', token);
}

/**
 * Queries the API for a playlist
 * @param id The id of the playlist
 * @param token The user token
 * @returns A playlist
 */
export async function getPlaylist(
  id: string,
  token?: UserTokenDTO,
): Promise<PlaylistDTO> {
  return authFetchCatchFail(`/api/playlists/${encodeURIComponent(id)}`, token);
}

export interface PlaylistOptions {
  name: string;
  description?: string;
  visibility?: string;
}
/**
 * Creates a playlist for a user
 * @param options The options for the playlist
 * @param token The user token
 * @returns The created playlist
 */
export async function createPlaylist(
  options: PlaylistOptions,
  token?: UserTokenDTO,
): Promise<PlaylistDTO> {
  return authFetchCatchFail('/api/playlists', token, {
    method: 'POST',
    body: JSON.stringify(options),
  });
}

/**
 * Adds a track to a playlist
 * @param playlist The playlist
 * @param track The track
 * @param token The user token
 * @returns The added track
 */
export async function addTrackToPlaylist(
  playlist: PlaylistDTO,
  track: ExternalTrack,
  token?: UserTokenDTO,
) {
  return authFetchCatchFail(`/api/playlists/${playlist.id}/tracks`, token, {
    method: 'POST',
    body: JSON.stringify({
      provider: track.provider,
      providerId: track.providerId,
    }),
  });
}

/**
 * Deletes a track from a playlist
 * @param playlist The playlist
 * @param track The track on the playlist
 * @param token The user token
 * @returns The deleted track
 */
export async function removeSongFromPlaylist(
  playlist: PlaylistDTO,
  track: TrackOnPlaylistDTO,
  token?: UserTokenDTO,
) {
  return authFetchCatchFail(`/api/playlists/${playlist.id}/tracks/${track.id}`, token, {
    method: 'DELETE',
  });
}
