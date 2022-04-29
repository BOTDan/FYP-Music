/* eslint-disable no-param-reassign */
import { AbstractRepository, EntityRepository } from 'typeorm';
import { AuthAccount } from '../entities/AuthAccount';
import { User } from '../entities/User';
import { AuthProvider } from '../types/public';

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
   * Updates the stored access/refresh tokens against an auth account
   * @param authAccount The auth account to save to
   * @param accessToken The access token to store
   * @param refreshToken The refresh token to store
   * @returns The updated auth account
   */
  updateTokens(authAccount: AuthAccount, accessToken: string, refreshToken?: string) {
    authAccount.accessToken = accessToken;
    authAccount.refreshToken = refreshToken;
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

  /**
   * Finds the first auth account of a user matching the given provider type
   * @param user The user
   * @param provider The provider ID of the account to find
   * @returns The found account, if it exists
   */
  findAuthAccountOfUser(user: User, provider: AuthProvider) {
    return this.repository.findOne({ where: { user, provider }, order: { dateUpdated: 'DESC' } });
  }

  /**
   * Finds all accounts linked t0 a user
   * @param user The user
   * @returns The linked accounts
   */
  findAllAuthAccountsOfUser(user: User) {
    return this.repository.find({ where: { user }, order: { dateCreated: 'ASC' } });
  }

  /**
   * Unlinks an account from a user, if the account belongs to them
   * @param id The id of the account to unlink
   * @param user The user the account belongs to
   * @returns The dleeted rows
   */
  unlinkAccount(id: string, user: User) {
    return this.repository.delete({ id, user });
  }
}
