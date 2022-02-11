import { AbstractRepository, EntityRepository } from 'typeorm';
import { User } from '../entities/User';
import { UserToken } from '../entities/UserToken';

@EntityRepository(UserToken)
export class UserTokenRepository extends AbstractRepository<UserToken> {
  /**
   * Finds a token and its user, if it exists
   * @param token The token to find
   * @returns The token, with attached user, if exists
   */
  findByToken(token: string) {
    return this.repository.findOne({ where: { token }, relations: ['user'] });
  }

  /**
   * Generates an auth token for the given user.
   * @param user The user to generate the token for
   * @returns A token, once generated
   */
  createToken(user: User) {
    const userToken = new UserToken();
    userToken.user = user;
    return this.repository.save(userToken);
  }
}
