import { ExternalTrack, MediaProvider } from '../types';

/**
 * Searches for a track from the API
 * @param provider The media provider to search from
 * @param q The search term
 * @returns A list of tracks
 */
export async function searchForTrack(provider: MediaProvider, q: string): Promise<ExternalTrack[]> {
  const response = await fetch(`/api/${provider.toLowerCase()}/tracks?q=${q}`);
  if (!response.ok) {
    throw new Error('Response not OK');
  }
  const data = await response.json();
  return data;
}
