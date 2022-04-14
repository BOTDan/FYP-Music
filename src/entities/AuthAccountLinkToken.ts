import {
  BeforeInsert, Entity, ManyToOne, PrimaryColumn,
} from 'typeorm';
import { createRandomToken, TOKEN_LENGTH } from '../Random';
import { AuthAccountLinkTokenDTO } from '../types/public';
import { AuthAccount } from './AuthAccount';
import { DatabaseEntity } from './base/DatabaseEntity';

/**
 * Stores a linking token to link an auth account to a user
 */
@Entity()
export class AuthAccountLinkToken extends DatabaseEntity {
  @PrimaryColumn({ type: 'char', length: TOKEN_LENGTH })
    token!: string;

  @ManyToOne(() => AuthAccount)
    authAccount!: AuthAccount;

  @BeforeInsert()
  setToken() {
    this.token = createRandomToken();
  }

  public get dto(): AuthAccountLinkTokenDTO {
    return {
      token: this.token,
    };
  }
}
