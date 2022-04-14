import {
  BeforeInsert, Entity, ManyToOne, PrimaryColumn,
} from 'typeorm';
import { createRandomToken, TOKEN_LENGTH } from '../Random';
import { UserTokenDTO } from '../types/public';
import { DatabaseEntity } from './base/DatabaseEntity';
import { User } from './User';

/**
 * Stores a login token against a user, to use for authentication.
 */
@Entity()
export class UserToken extends DatabaseEntity {
  @PrimaryColumn({ type: 'char', length: TOKEN_LENGTH })
    token!: string;

  @ManyToOne(() => User)
    user!: User;

  @BeforeInsert()
  setToken() {
    this.token = createRandomToken();
  }

  public get dto(): UserTokenDTO {
    return {
      token: this.token,
      user: this.user.dto,
    };
  }
}
