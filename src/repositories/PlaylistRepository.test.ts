import { Connection, getConnection } from 'typeorm';
import { setupDatabase } from '../database';
import { Playlist } from '../entities/Playlist';
import { User } from '../entities/User';
import { PlaylistVisibility } from '../types/public';
import { PlaylistRepository } from './PlaylistRepository';
import { UserRepository } from './UserRepository';

describe('Playlist repository', () => {
  let connection: Connection;
  let repo: PlaylistRepository;
  let testUser: User;
  let testPlaylist: Playlist;

  beforeAll(async () => {
    await setupDatabase();
    connection = getConnection('test');
    repo = connection.getCustomRepository(PlaylistRepository);

    testUser = await connection.getCustomRepository(UserRepository).createUser('Playlist Test User');
  });

  afterAll(async () => {
    await connection.close();
  });

  it('should create a playlist', async () => {
    testPlaylist = await repo.createPlaylist({
      name: 'Test Playlist',
      owner: testUser,
    });

    expect(testPlaylist).toBeInstanceOf(Playlist);
    expect(testPlaylist.name).toBe('Test Playlist');
    expect(testPlaylist.description).toBe('');
    expect(testPlaylist.owner.id).toBe(testUser.id);
    expect(testPlaylist.visibility).toBe(PlaylistVisibility.Private);
  });

  it('should update a playlist', async () => {
    const updated = await repo.updatePlaylist(testPlaylist, {
      description: 'Description',
      name: 'Updated Playlist',
      visibility: PlaylistVisibility.Public,
    });

    expect(updated).toBeInstanceOf(Playlist);
    expect(updated.name).toBe('Updated Playlist');
    expect(updated.description).toBe('Description');
    expect(updated.owner.id).toBe(testUser.id);
    expect(updated.visibility).toBe(PlaylistVisibility.Public);
    expect(updated.id).toBe(testPlaylist.id);
  });

  it('should find a playlist by ID', async () => {
    const playlist = await repo.getPlaylist(testPlaylist.id);

    expect(playlist).not.toBeUndefined();
    expect(playlist).toBeInstanceOf(Playlist);
    expect(playlist!.name).toBe('Updated Playlist');
    expect(playlist!.id).toBe(testPlaylist.id);
  });

  it('should find a user\'s playlists', async () => {
    const playlists = await repo.getUserPlaylists(testUser);

    expect(playlists).toHaveLength(1);
    expect(playlists[0]).toBeInstanceOf(Playlist);
    expect(playlists[0]!.name).toBe('Updated Playlist');
    expect(playlists[0]!.id).toBe(testPlaylist.id);
  });

  it('should find the owner of a playlist', async () => {
    const owner = await repo.getPlaylistOwner(testPlaylist);

    expect(owner).toBeInstanceOf(User);
    expect(owner!.id).toBe(testUser.id);
  });
});
