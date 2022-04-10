import { authFetchCatchFail } from '.';
import {
  ExternalPlaylist, InternalPlaylist, MediaProvider, UserTokenDTO,
} from '../types';

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
): Promise<InternalPlaylist[]> {
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
): Promise<InternalPlaylist> {
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
): Promise<InternalPlaylist> {
  return authFetchCatchFail('/api/playlists', token, {
    method: 'POST',
    body: JSON.stringify(options),
  });
}
