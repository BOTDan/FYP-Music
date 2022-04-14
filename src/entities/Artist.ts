import { Column, Entity, PrimaryColumn } from 'typeorm';
import { MediaProvider } from '../apis/providers/base';
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

  public get dto(): ArtistDTO {
    return {
      provider: this.provider,
      providerId: this.providerId,
      providerData: this.providerData,
      name: this.name,
      image: this.image,
    };
  }
}

export interface ArtistDTO {
  provider: MediaProvider;
  providerId: string;
  providerData?: any;
  name: string;
  image?: string;
}
