import { authFetchCatchFail } from '.';
import { ExternalTrack, UserTokenDTO } from '../types/public';

/**
 * Plays a track
 * @param track The track to play
 * @param token The user token
 * @returns Null if successful
 */
export async function playTrack(track: ExternalTrack, token: UserTokenDTO, device?: string) {
  return authFetchCatchFail(`/api/${track.provider}/me/play/${track.providerId}${device ? `?device=${device}` : ''}`, token, {
    method: 'POST',
  });
}
