import { Column, Entity, PrimaryColumn } from 'typeorm';
import { MediaProvider, ExternalArtist } from '../types/public';
import { DatabaseEntity } from './base/DatabaseEntity';

@Entity()
// @Unique('UQ_ARTISTS', ['provider', 'providerId'])
export class Artist extends DatabaseEntity {
  @PrimaryColumn({ type: 'varchar' })
    provider!: MediaProvider;

  @Column({ type: 'varchar' })
    name!: string;

  @Column({ type: 'text', nullable: true })
    image?: string;

  @PrimaryColumn({ type: 'varchar', length: 128 })
    providerId!: string;

  @Column({ type: 'json', nullable: true })
    providerData?: {};

  public get dto(): ExternalArtist {
    return {
      provider: this.provider,
      providerId: this.providerId,
      name: this.name,
      image: this.image,
    };
  }
}
