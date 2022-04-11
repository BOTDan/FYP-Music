import {
  Column, Entity, JoinTable, ManyToMany, Unique,
} from 'typeorm';
import { MediaProvider } from '../apis/providers/base';
import { Artist } from './Artist';
import { DatabaseEntityWithID } from './base/DatabaseEntityWithID';

/**
 * Represents a song. Should be used to represent the data back from the API, not user data.
 */
@Entity()
@Unique('UQ_TRACKS', ['provider', 'providerId'])
export class Track extends DatabaseEntityWithID {
  @Column({ type: 'enum', enum: MediaProvider })
    provider!: MediaProvider;

  @Column({ type: 'varchar' })
    name!: string;

  @Column({ type: 'int' })
    duration!: number;

  @Column({ type: 'text', nullable: true })
    image?: string;

  @ManyToMany(() => Artist)
  @JoinTable()
    artists!: Artist[];

  @Column({ type: 'varchar', length: 128 })
    providerId!: string;

  @Column({ type: 'json', nullable: true })
    providerData?: {};
}
