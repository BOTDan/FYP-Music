import {
  Column, Entity, ManyToOne, Unique,
} from 'typeorm';
import { DatabaseEntityWithID } from './base/DatabaseEntityWithID';
import { User } from './User';

export enum AuthProvider {
  Spotify = 'spotify',
  Google = 'Google',
}

/**
 * Stores information about a login account.
 * Linked to the user who owns the account.
 */
@Entity()
export class AuthAccount extends DatabaseEntityWithID {
  @Column({ type: 'enum', enum: AuthProvider })
    provider!: AuthProvider;

  @Column({ type: 'varchar', length: 128 })
    authId!: string;

  @Unique(['provider', 'authId'])

  @ManyToOne(() => User)
    user?: User;
}
