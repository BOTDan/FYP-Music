import { AbstractRepository, EntityRepository } from 'typeorm';
import { MediaProvider } from '../apis/providers/base';
import { Artist } from '../entities/Artist';
import { Track } from '../entities/Track';

export interface TrackData {
  provider: MediaProvider;
  providerId: string;
  name: string;
  length: number;
  artists: Artist[];
  image?: string;
  providerData?: {};
}

@EntityRepository(Track)
export class TrackRepository extends AbstractRepository<Track> {
  /**
   * Creates a song in the database
   * @param options The song options
   * @returns The created song
   */
  createTrack(options: TrackData) {
    const track = new Track();
    track.provider = options.provider;
    track.providerId = options.providerId;
    track.name = options.name;
    track.length = options.length;
    track.artists = options.artists;
    track.image = options.image;
    track.providerData = options.providerData;
    return this.repository.save(track);
  }
}
