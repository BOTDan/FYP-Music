import {
  Column, Entity, JoinTable, ManyToMany, PrimaryColumn,
} from 'typeorm';
import { ExternalTrack, MediaProvider } from '../apis/providers/base';
import { Artist } from './Artist';
import { DatabaseEntity } from './base/DatabaseEntity';

/**
 * Represents a song. Should be used to represent the data back from the API, not user data.
 */
@Entity()
// @Unique('UQ_TRACKS', ['provider', 'providerId'])
export class Track extends DatabaseEntity {
  @PrimaryColumn({ type: 'varchar' })
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

  @PrimaryColumn({ type: 'varchar', length: 128 })
    providerId!: string;

  @Column({ type: 'json', nullable: true })
    providerData?: {};

  public get dto(): ExternalTrack {
    return {
      provider: this.provider,
      providerId: this.providerId,
      name: this.name,
      duration: this.duration,
      image: this.image,
      artists: this.artists.map((artist) => artist.dto),
    };
  }
}
