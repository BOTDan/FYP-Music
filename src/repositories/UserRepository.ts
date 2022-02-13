import { AbstractRepository, EntityRepository } from 'typeorm';
import { User } from '../entities/User';

/**
 * Repository for interacting with users in the database
 */
@EntityRepository(User)
export class UserRepository extends AbstractRepository<User> {
  /**
   * Creates a user in the database
   * @param displayName The display name of the user
   * @returns The new user
   */
  createUser(displayName: string) {
    const user = new User();
    user.displayName = displayName;
    return this.repository.save(user);
  }
}
