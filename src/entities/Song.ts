import {
  Column, Entity, JoinTable, ManyToMany, Unique,
} from 'typeorm';
import { MediaProvider } from '../apis';
import { Artist } from './Artist';
import { DatabaseEntityWithID } from './base/DatabaseEntityWithID';

/**
 * Represents a song. Should be used to represent the data back from the API, not user data.
 */
@Entity()
@Unique('UQ_SONGS', ['provider', 'providerId'])
export class Song extends DatabaseEntityWithID {
  @Column({ type: 'enum', enum: MediaProvider })
    provider!: MediaProvider;

  @Column({ type: 'varchar' })
    name!: string;

  @Column({ type: 'int' })
    length!: number;

  @Column({ type: 'text' })
    image?: string;

  @ManyToMany(() => Artist)
  @JoinTable()
    artists!: Artist[];

  @Column({ type: 'varchar', length: 128 })
    providerId!: string;

  @Column({ type: 'json' })
    providerData?: {};
}
