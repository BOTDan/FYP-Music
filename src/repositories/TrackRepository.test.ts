import { Connection, getConnection } from 'typeorm';
import { setupDatabase } from '../database';
import { Artist } from '../entities/Artist';
import { Track } from '../entities/Track';
import { MediaProvider } from '../types/public';
import { TrackRepository } from './TrackRepository';

describe('Track repository', () => {
  let connection: Connection;
  let repo: TrackRepository;

  beforeAll(async () => {
    await setupDatabase();
    connection = getConnection('test');
    repo = connection.getCustomRepository(TrackRepository);
  });

  afterAll(async () => {
    await connection.close();
  });

  it('should create a track', async () => {
    const track = await repo.registerTrack({
      provider: MediaProvider.YouTube,
      providerId: 'trackrepotest',
      name: 'Track Repo Test',
      duration: 1000,
      artists: [
        {
          name: 'Track Repo Test Artist #1',
          provider: MediaProvider.YouTube,
          providerId: 'trackrepotestartist#1',
        },
        {
          name: 'Track Repo Test Artist #2',
          provider: MediaProvider.YouTube,
          providerId: 'trackrepotestartist#2',
        },
      ],
    }, 'test');

    expect(track).not.toBeUndefined();
    expect(track).toBeInstanceOf(Track);
    expect(track.name).toBe('Track Repo Test');
    expect(track.providerId).toBe('trackrepotest');
    expect(track.provider).toBe(MediaProvider.YouTube);
    expect(track.duration).toBe(1000);
    expect(track.artists).toHaveLength(2);
    expect(track.artists[0]).toBeInstanceOf(Artist);
    expect(track.artists[0].name).toBe('Track Repo Test Artist #1');
    expect(track.artists[0].providerId).toBe('trackrepotestartist#1');
    expect(track.artists[1]).toBeInstanceOf(Artist);
  });

  it('should find the created track', async () => {
    const track = await repo.findTrackByProvider(MediaProvider.YouTube, 'trackrepotest');

    expect(track).not.toBeUndefined();
    expect(track).toBeInstanceOf(Track);
    expect(track!.name).toBe('Track Repo Test');
    expect(track!.providerId).toBe('trackrepotest');
    expect(track!.provider).toBe(MediaProvider.YouTube);
    expect(track!.duration).toBe(1000);
    expect(track!.artists).toHaveLength(2);
    expect(track!.artists[0]).toBeInstanceOf(Artist);
    expect(track!.artists[0].name).toBe('Track Repo Test Artist #1');
    expect(track!.artists[0].providerId).toBe('trackrepotestartist#1');
    expect(track!.artists[1]).toBeInstanceOf(Artist);
  });

  it('should not find a track with same id from different provider', async () => {
    const track = await repo.findTrackByProvider(MediaProvider.Spotify, 'trackrepotest');

    expect(track).toBeUndefined();
  });
});
