import { AbstractRepository, EntityRepository } from 'typeorm';
import { AuthAccount } from '../entities/AuthAccount';
import { AuthAccountLinkToken } from '../entities/AuthAccountLinkToken';

@EntityRepository(AuthAccountLinkToken)
export class AuthAccountLinkTokenRepository extends AbstractRepository<AuthAccountLinkToken> {
  /**
   * Finds a linking token and the auth account it links to.
   * @param token The token to find
   * @returns The link token, with attached authAccount
   */
  findByToken(token: string) {
    return this.repository.findOne({ where: { token }, relations: ['authAccount', 'authAccount.user'] });
  }

  /**
   * Generates a linking token for the given auth account
   * @param authAccount The auth account to generate the linking token for
   * @returns The linking token, once generated
   */
  createToken(authAccount: AuthAccount) {
    const token = new AuthAccountLinkToken();
    token.authAccount = authAccount;
    return this.repository.save(token);
  }

  /**
   * Deletes a linking token from the database, if possible
   * @param token The linking token to delete
   * @returns The dleeted token, if deleted
   */
  deleteToken(token: AuthAccountLinkToken) {
    return this.repository.remove(token);
  }
}
