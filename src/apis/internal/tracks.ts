import { getCustomRepository } from 'typeorm';
import { User } from '../../entities/User';
import { InternalServerError } from '../../errors/httpstatus';
import { TrackRepository } from '../../repositories/TrackRepository';
import { externalAPIs } from '../providers';
import { MediaProvider } from '../providers/base';

/**
 * Finds or creates a track in the DB
 * @param provider The media provider
 * @param providerId The unique ID from the provider
 * @returns The track from the database
 */
export async function getOrCreateTrack(provider: MediaProvider, providerId: string, user?: User) {
  const trackRepo = getCustomRepository(TrackRepository);
  const track = await trackRepo.findTrackByProvider(provider, providerId);
  if (track) { return track; }

  console.log('Not created');

  // Track doesn't exist in DB, create it.
  const api = externalAPIs[provider];
  if (!api) { throw new InternalServerError(`Media provider ${provider} missing`); }
  const externalTrack = await api.getTrack(providerId, user);
  console.log(externalTrack);

  return trackRepo.registerTrack(externalTrack);
}
