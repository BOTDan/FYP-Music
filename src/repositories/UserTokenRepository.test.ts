import { Connection, getConnection } from 'typeorm';
import { setupDatabase } from '../database';
import { User } from '../entities/User';
import { UserToken } from '../entities/UserToken';
import { UserRepository } from './UserRepository';
import { UserTokenRepository } from './UserTokenRepository';

describe('User Token repository', () => {
  let connection: Connection;
  let repo: UserTokenRepository;
  let userRepo: UserRepository;
  let testUser: User;
  let testToken: UserToken;

  beforeAll(async () => {
    await setupDatabase();
    connection = getConnection('test');
    repo = connection.getCustomRepository(UserTokenRepository);
    userRepo = connection.getCustomRepository(UserRepository);

    testUser = await userRepo.createUser('User Token Test User');
  });

  afterAll(async () => {
    await connection.close();
  });

  it('should create a token', async () => {
    const token = await repo.createToken(testUser);

    testToken = token;

    expect(token).toBeInstanceOf(UserToken);
    expect(token.user).not.toBeUndefined();
    expect(token.user.displayName).toBe('User Token Test User');
    expect(typeof token.token).toBe('string');
  });

  it('should find a user by their token', async () => {
    const token = await repo.findByToken(testToken.token);

    expect(token).toBeInstanceOf(UserToken);
    expect(token).not.toBeUndefined();
    expect(token!.user).not.toBeUndefined();
    expect(token!.user.displayName).toBe('User Token Test User');
    expect(typeof token!.token).toBe('string');
  });

  it('should delete a token', async () => {
    const token = await repo.deleteToken(testToken);

    expect(token).not.toBeUndefined();
    expect(token).not.toBeNull();
    expect(token).toBeInstanceOf(UserToken);

    const tokenCheck = await repo.findByToken(testToken.token);

    expect(tokenCheck).toBeUndefined();
  });

  it('should not find deleted tokens', async () => {
    const tokenCheck = await repo.findByToken(testToken.token);

    expect(tokenCheck).toBeUndefined();
  });

  it('should not find invalid tokens', async () => {
    const tokenCheck = await repo.findByToken('');

    expect(tokenCheck).toBeUndefined();
  });
});
