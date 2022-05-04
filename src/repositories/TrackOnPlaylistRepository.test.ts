import { Connection, getConnection } from 'typeorm';
import { setupDatabase } from '../database';
import { Playlist } from '../entities/Playlist';
import { Track } from '../entities/Track';
import { TrackOnPlaylist } from '../entities/TrackOnPlaylist';
import { User } from '../entities/User';
import { MediaProvider } from '../types/public';
import { PlaylistRepository } from './PlaylistRepository';
import { TrackOnPlaylistRepository } from './TrackOnPlaylistRepository';
import { TrackRepository } from './TrackRepository';
import { UserRepository } from './UserRepository';

describe('Track On Playlist repository', () => {
  let connection: Connection;
  let repo: TrackOnPlaylistRepository;
  let playlistRepo: PlaylistRepository;
  let trackRepo: TrackRepository;
  let testUser: User;
  let testTrack: Track;
  let testPlaylist: Playlist;
  let testEntry: TrackOnPlaylist;

  beforeAll(async () => {
    await setupDatabase();
    connection = getConnection('test');
    repo = connection.getCustomRepository(TrackOnPlaylistRepository);
    playlistRepo = connection.getCustomRepository(PlaylistRepository);
    trackRepo = connection.getCustomRepository(TrackRepository);

    testUser = await connection.getCustomRepository(UserRepository).createUser('Track On Playlist Test User');

    testTrack = await trackRepo.registerTrack({
      provider: MediaProvider.YouTube,
      providerId: 'trackonplaylisttest',
      name: 'Track on Playlist #1',
      duration: 1000,
      artists: [
        {
          name: 'Artist #1',
          provider: MediaProvider.YouTube,
          providerId: 'trackonplaylisttestartist',
        },
      ],
    }, 'test');

    testPlaylist = await playlistRepo.createPlaylist({
      name: 'Track on Playlist Playlist',
      owner: testUser,
    });
  });

  afterAll(async () => {
    await connection.close();
  });

  it('should add a track to a playlist', async () => {
    testEntry = await repo.addTrackToPlaylist(testPlaylist, testTrack);

    expect(testEntry).toBeInstanceOf(TrackOnPlaylist);
    expect(typeof testEntry.id).toBe('string');
    expect(testEntry.playlist.id).toBe(testPlaylist.id);
    expect(testEntry.track.providerId).toBe('trackonplaylisttest');
  });

  it('should add the same track to the same playlist', async () => {
    const trackentry = await repo.addTrackToPlaylist(testPlaylist, testTrack);

    expect(trackentry).toBeInstanceOf(TrackOnPlaylist);
    expect(typeof trackentry.id).toBe('string');
    expect(trackentry.id).not.toBe(testEntry.id);
    expect(trackentry.playlist.id).toBe(testPlaylist.id);
    expect(trackentry.track.providerId).toBe('trackonplaylisttest');
  });

  it('should find a track on playlist by id', async () => {
    const trackentry = await repo.getTrackInPlaylist(testEntry.id);

    expect(trackentry).toBeInstanceOf(TrackOnPlaylist);
    expect(trackentry!.id).toBe(testEntry.id);
    expect(trackentry!.playlist.id).toBe(testPlaylist.id);
    expect(trackentry!.track.providerId).toBe('trackonplaylisttest');
  });

  it('should delete a track on playlist', async () => {
    const deleted = await repo.deleteTrackFromPlaylist(testEntry);

    expect(deleted).toBeInstanceOf(TrackOnPlaylist);
    expect(deleted!.id).toBe(testEntry.id);
  });

  it('should not find deleted track on playlists', async () => {
    const trackentry = await repo.getTrackInPlaylist(testEntry.id);

    expect(trackentry).toBeUndefined();
  });
});
