import { Connection, getConnection } from 'typeorm';
import { setupDatabase } from '../database';
import { AuthProvider } from '../entities/AuthAccount';
import { AuthAccountLinkToken } from '../entities/AuthAccountLinkToken';
import { AuthAccountLinkTokenRepository } from './AuthAccountLinkTokenRepository';
import { AuthAccountRepository } from './AuthAccountRepository';

describe('Auth Account Link Token repository', () => {
  let connection: Connection;
  let authAccountRepo: AuthAccountRepository;
  let repo: AuthAccountLinkTokenRepository;

  beforeAll(async () => {
    await setupDatabase();
    connection = getConnection('test');
    repo = connection.getCustomRepository(AuthAccountLinkTokenRepository);
    authAccountRepo = connection.getCustomRepository(AuthAccountRepository);
  });

  afterAll(async () => {
    await connection.close();
  });

  it('should create a token', async () => {
    const authAccount = await authAccountRepo.createAuthAccount(AuthProvider.Google, 'linktoken_test');

    const result = await repo.createToken(authAccount);
    expect(result).toBeInstanceOf(AuthAccountLinkToken);
    expect(result.authAccount).toBe(authAccount);
  });
});
