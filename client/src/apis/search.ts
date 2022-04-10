import { authFetchCatchFail } from '.';
import { ExternalTrack, MediaProvider, UserTokenDTO } from '../types';

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
  return authFetchCatchFail(`/api/${provider.toLowerCase()}/tracks?q=${q}`, token);
}
