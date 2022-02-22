import { AbstractRepository, EntityRepository } from 'typeorm';
import { MediaProvider } from '../apis';
import { Artist } from '../entities/Artist';

export interface ArtistData {
  name: string;
  provider: MediaProvider;
  providerId: string;
  image?: string;
  providerData?: {}
}

@EntityRepository(Artist)
export class ArtistRepository extends AbstractRepository<Artist> {
  /**
   * Creates an artist in the database
   * @param options The options defining the artist
   * @returns An artist
   */
  createArtist(options: ArtistData) {
    const artist = new Artist();
    artist.provider = options.provider;
    artist.providerId = options.providerId;
    artist.name = options.name;
    artist.image = options.image;
    artist.providerData = options.providerData;
    return this.repository.save(artist);
  }

  /**
   * Finds an artist in the databse with the given internal ID
   * @param id The internal ID of the artist
   * @returns An artist, if exists
   */
  findArtistById(id: string) {
    return this.repository.findOne(id);
  }

  /**
   * Finds an artist in the database from the given provider
   * @param provider The provider
   * @param providerId The ID given by the provider
   * @returns An artist, if exists
   */
  findArtistByProvider(provider: MediaProvider, providerId: string) {
    return this.repository.find({ where: { provider, providerId } });
  }

  /**
   * Attempots to find an artist. If not found, will create the artist.
   * @param options The options defining the artist
   * @returns An artist
   */
  async findOrCreateArtist(options: ArtistData) {
    const result = await this.findArtistByProvider(options.provider, options.providerId);
    if (result) {
      return result;
    }
    return this.createArtist(options);
  }
}
