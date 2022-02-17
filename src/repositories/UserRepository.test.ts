import { Connection, getConnection } from 'typeorm';
import { setupDatabase } from '../database';
import { User } from '../entities/User';
import { UserRepository } from './UserRepository';

describe('User repository', () => {
  let connection: Connection;
  let repo: UserRepository;

  beforeAll(async () => {
    await setupDatabase();
    connection = getConnection('test');
    repo = connection.getCustomRepository(UserRepository);
  });

  afterAll(async () => {
    await connection.close();
  });

  it('should create a user', async () => {
    const result = await repo.createUser('Test');
    expect(result).toBeInstanceOf(User);
    expect(result.displayName).toBe('Test');
    expect(result.id.length).toBe(16);
  });
});
