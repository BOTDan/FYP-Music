import { AbstractRepository, EntityRepository } from 'typeorm';
import { AuthAccount, AuthProvider } from '../entities/AuthAccount';
import { User } from '../entities/User';

@EntityRepository(AuthAccount)
export class AuthAccountRepository extends AbstractRepository<AuthAccount> {
  /**
   * Returns the account with given id and provider, if eists
   * @param provider The enum of the auth rpovider
   * @param authId The external id of the user
   * @returns An account if found, else undefined
   */
  findByAuthId(provider: AuthProvider, authId: string) {
    return this.repository.findOne({ where: { provider, authId }, relations: ['user'] });
  }

  /**
   * Creates an auth account and saves it to the database
   * @param provider The authprovider
   * @param authId The id from the auth rpovider
   * @param user The user to attach the account to
   * @returns An AuthAccount
   */
  createAuthAccount(provider: AuthProvider, authId: string, user?: User) {
    const authAccount = new AuthAccount();
    authAccount.provider = provider;
    authAccount.authId = authId;
    authAccount.user = user;
    return this.repository.save(authAccount);
  }

  /**
   * Creates a spotify auth account linked to the given user and saves it to the database.
   * @param spotifyId The spotify ID of the user
   * @param user The user to attach the account to
   * @returns An AuthAccount
   */
  createSpotifyAccount(spotifyId: string, user?: User) {
    return this.createAuthAccount(AuthProvider.Spotify, spotifyId, user);
  }

  /**
  * Creates a google auth account linked to the given user and saves it to the database.
  * @param googleId The google ID of the user
  * @param user The user to attach the account to
  * @returns An AuthAccount
  */
  createGoogleAccount(googleId: string, user?: User) {
    return this.createAuthAccount(AuthProvider.Google, googleId, user);
  }

  /**
   * Updates an auth account, setting which user it belongs to
   * @param authAccount The auth account to link
   * @param user The user to link to it
   * @returns The updated authAccount
   */
  linkAuthAccountToUser(authAccount: AuthAccount, user: User) {
    // eslint-disable-next-line no-param-reassign
    authAccount.user = user;
    return this.repository.save(authAccount);
  }
}
