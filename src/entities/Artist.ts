import { Column, Entity, Unique } from 'typeorm';
import { MediaProvider } from '../apis/providers/base';
import { DatabaseEntityWithID } from './base/DatabaseEntityWithID';

@Entity()
@Unique('UQ_ARTISTS', ['provider', 'providerId'])
export class Artist extends DatabaseEntityWithID {
  @Column({ type: 'enum', enum: MediaProvider })
    provider!: MediaProvider;

  @Column({ type: 'varchar' })
    name!: string;

  @Column({ type: 'text', nullable: true })
    image?: string;

  @Column({ type: 'varchar', length: 128 })
    providerId!: string;

  @Column({ type: 'json', nullable: true })
    providerData?: {};
}
