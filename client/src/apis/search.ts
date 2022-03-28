import { ExternalTrack, MediaProvider, UserTokenDTO } from '../types';

/**
 * Makes an authenticated fetch request
 * @param url The url to fetch from
 * @param token The token to use for auth
 * @param options Any more request options
 * @returns The fetch request
 */
function authFetch(url: string, token?: UserTokenDTO, options?: RequestInit) {
  const headers: HeadersInit = {};
  if (token && token.token.length > 0) {
    headers.authorization = `Bearer ${token.token}`;
  }
  return fetch(url, { headers, ...options });
}

/**
 * Searches for a track from the API
 * @param provider The media provider to search from
 * @param q The search term
 * @returns A list of tracks
 */
export async function searchForTrack(
  provider: MediaProvider,
  q: string,
  token?: UserTokenDTO,
): Promise<ExternalTrack[]> {
  const response = await authFetch(`/api/${provider.toLowerCase()}/tracks?q=${q}`, token);
  if (!response.ok) {
    throw new Error('Response not OK');
  }
  const data = await response.json();
  return data;
}
