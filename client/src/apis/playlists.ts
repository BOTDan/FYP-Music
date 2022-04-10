import { authFetch } from '.';
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
  const response = await authFetch(`/api/${provider.toLowerCase()}/me/playlists`, token);
  if (!response.ok) {
    throw new Error('Response not OK');
  }
  const data = await response.json();
  return data;
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
  const response = await authFetch(`/api/${provider.toLowerCase()}/playlists/${encodeURIComponent(id)}`, token);
  if (!response.ok) {
    throw new Error('Response not OK');
  }
  const data = await response.json();
  return data;
}

/**
 * Gets the users playlists
 * @param token The user token
 * @returns A list of owned playlists
 */
export async function getMyPlaylists(
  token: UserTokenDTO,
): Promise<InternalPlaylist[]> {
  const response = await authFetch('/api/me/playlists/', token);
  if (!response.ok) {
    throw new Error('Response not OK');
  }
  const data = await response.json();
  return data;
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
  const response = await authFetch(`/api/playlists/${encodeURIComponent(id)}`, token);
  if (!response.ok) {
    throw new Error('Response not OK');
  }
  const data = await response.json();
  return data;
}
