import { authFetch } from '.';
import { ExternalPlaylist, MediaProvider, UserTokenDTO } from '../types';

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
