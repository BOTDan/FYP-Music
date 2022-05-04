import { Connection, getConnection } from 'typeorm';
import { setupDatabase } from '../database';
import { Artist } from '../entities/Artist';
import { MediaProvider } from '../types/public';
import { ArtistRepository } from './ArtistRepository';

describe('Artist repository', () => {
  let connection: Connection;
  let repo: ArtistRepository;

  beforeAll(async () => {
    await setupDatabase();
    connection = getConnection('test');
    repo = connection.getCustomRepository(ArtistRepository);
  });

  afterAll(async () => {
    await connection.close();
  });

  it('should create an artist', async () => {
    const artist = await repo.createArtist({
      name: 'Test Artist',
      provider: MediaProvider.YouTube,
      providerId: 'testartist',
    });

    expect(artist).toBeInstanceOf(Artist);
    expect(artist.name).toBe('Test Artist');
    expect(artist.provider).toBe(MediaProvider.YouTube);
    expect(artist.providerId).toBe('testartist');
  });

  it('should find an existing artist by provider data', async () => {
    const artist = await repo.findArtistByProvider(MediaProvider.YouTube, 'testartist');

    expect(artist).not.toBeUndefined();
    expect(artist).toBeInstanceOf(Artist);
    expect(artist!.name).toBe('Test Artist');
    expect(artist!.provider).toBe(MediaProvider.YouTube);
    expect(artist!.providerId).toBe('testartist');
  });

  it('should create a new artist when not exists', async () => {
    const artist = await repo.findOrCreateArtist({
      name: 'Artist #2',
      provider: MediaProvider.Spotify,
      providerId: 'testartist2',
    });

    expect(artist).not.toBeUndefined();
    expect(artist).toBeInstanceOf(Artist);
    expect(artist!.name).toBe('Artist #2');
    expect(artist!.provider).toBe(MediaProvider.Spotify);
    expect(artist!.providerId).toBe('testartist2');
  });

  it('should retrieve an artist if already exists', async () => {
    const artist = await repo.findOrCreateArtist({
      name: 'Incorrect name',
      provider: MediaProvider.Spotify,
      providerId: 'testartist2',
    });

    expect(artist).not.toBeUndefined();
    expect(artist).toBeInstanceOf(Artist);
    expect(artist!.name).toBe('Artist #2');
    expect(artist!.provider).toBe(MediaProvider.Spotify);
    expect(artist!.providerId).toBe('testartist2');
  });
});
