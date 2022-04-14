import { AbstractRepository, EntityRepository, getCustomRepository } from 'typeorm';
import { ExternalTrack, MediaProvider } from '../apis/providers/base';
import { Artist } from '../entities/Artist';
import { Track } from '../entities/Track';
import { ArtistRepository } from './ArtistRepository';

export interface TrackData {
  provider: MediaProvider;
  providerId: string;
  name: string;
  duration: number;
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
    track.duration = options.duration;
    track.artists = options.artists;
    track.image = options.image;
    track.providerData = options.providerData;
    return this.repository.save(track);
  }

  /**
   * Creates a track in the database
   * @param trackData The external track
   * @returns The created track
   */
  async registerTrack(trackData: ExternalTrack) {
    const artistRepo = getCustomRepository(ArtistRepository);
    const artistPromises = trackData.artists.map((artist) => artistRepo.findOrCreateArtist(artist));
    const artists = await Promise.all(artistPromises);
    return this.createTrack({
      provider: trackData.provider,
      providerId: trackData.providerId,
      name: trackData.name,
      duration: trackData.duration,
      artists,
      image: trackData.image,
    });
  }

  /**
   * Finds a track in the database, if exists
   * @param provider The media provider
   * @param providerId The unique id from the provider
   * @returns A track, if exists in the database
   */
  findTrackByProvider(provider: MediaProvider, providerId: string) {
    return this.repository.findOne({ where: { provider, providerId }, relations: ['artists'] });
  }
}
