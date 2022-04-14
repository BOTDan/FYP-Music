import { Column, Entity } from 'typeorm';
import { UserDTO } from '../types/public';
import { DatabaseEntityWithID } from './base/DatabaseEntityWithID';

/**
 * User entity. Stores information about an end-user (an account).
 */
@Entity()
export class User extends DatabaseEntityWithID {
  @Column({ type: 'varchar', length: 64 })
    displayName!: string;

  public get dto(): UserDTO {
    return {
      id: this.id,
      displayName: this.displayName,
    };
  }
}
