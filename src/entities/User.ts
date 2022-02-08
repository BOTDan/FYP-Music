import { Column, Entity } from 'typeorm';
import { DatabaseEntityWithID } from './base/DatabaseEntityWithID';

/**
 * User entity. Stores information about an end-user (an account).
 */
@Entity()
export class User extends DatabaseEntityWithID {
  @Column({ type: 'varchar', length: 32 })
    username!: string;
}
