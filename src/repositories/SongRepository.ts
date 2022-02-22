import { AbstractRepository, EntityRepository } from 'typeorm';
import { MediaProvider } from '../apis';
import { Artist } from '../entities/Artist';
import { Song } from '../entities/Song';

export interface SongData {
  provider: MediaProvider;
  providerId: string;
  name: string;
  length: number;
  artists: Artist[];
  image?: string;
  providerData?: {};
}

@EntityRepository(Song)
export class SongRepository extends AbstractRepository<Song> {
  /**
   * Creates a song in the database
   * @param options The song options
   * @returns The created song
   */
  createSong(options: SongData) {
    const song = new Song();
    song.provider = options.provider;
    song.providerId = options.providerId;
    song.name = options.name;
    song.length = options.length;
    song.artists = options.artists;
    song.image = options.image;
    song.providerData = options.providerData;
    return this.repository.save(song);
  }
}
