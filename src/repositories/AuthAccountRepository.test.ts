import { Connection, getConnection } from 'typeorm';
import { setupDatabase } from '../database';
import { AuthAccount } from '../entities/AuthAccount';
import { AuthProvider } from '../types/public';
import { AuthAccountRepository } from './AuthAccountRepository';
import { UserRepository } from './UserRepository';

describe('Auth Account repository', () => {
  let connection: Connection;
  let repo: AuthAccountRepository;

  beforeAll(async () => {
    await setupDatabase();
    connection = getConnection('test');
    repo = connection.getCustomRepository(AuthAccountRepository);
  });

  afterAll(async () => {
    await connection.close();
  });

  it('should create a Google auth account', async () => {
    const result = await repo.createAuthAccount(AuthProvider.Google, 'google_id');
    expect(result).toBeInstanceOf(AuthAccount);
    expect(result.authId).toBe('google_id');
    expect(result.provider).toBe(AuthProvider.Google);
  });

  it('should create a Spotify auth account', async () => {
    const result = await repo.createAuthAccount(AuthProvider.Spotify, 'spotify_id');
    expect(result).toBeInstanceOf(AuthAccount);
    expect(result.authId).toBe('spotify_id');
    expect(result.provider).toBe(AuthProvider.Spotify);
  });

  it('should find the Google account', async () => {
    const result = await repo.findByAuthId(AuthProvider.Google, 'google_id');
    expect(result).not.toBeUndefined();
    expect(result).toBeInstanceOf(AuthAccount);
    expect(result?.authId).toBe('google_id');
    expect(result?.provider).toBe(AuthProvider.Google);
  });

  it('should find the Spotify account', async () => {
    const result = await repo.findByAuthId(AuthProvider.Spotify, 'spotify_id');
    expect(result).not.toBeUndefined();
    expect(result).toBeInstanceOf(AuthAccount);
    expect(result?.authId).toBe('spotify_id');
    expect(result?.provider).toBe(AuthProvider.Spotify);
  });

  it('shouldn\'t find a Google account with Spotify ID', async () => {
    const result = await repo.findByAuthId(AuthProvider.Google, 'spotify_id');
    expect(result).toBeUndefined();
  });

  it('should link an auth account to a user', async () => {
    const userRepo = connection.getCustomRepository(UserRepository);
    const user = await userRepo.createUser('authaccount_test');
    const account = await repo.findByAuthId(AuthProvider.Google, 'google_id');

    expect(account).not.toBeUndefined();

    const result = await repo.linkAuthAccountToUser(account!, user);
    expect(result).toBeInstanceOf(AuthAccount);
    expect(result.user).not.toBeUndefined();
    expect(result.user?.id).toEqual(user.id);
  });
});
