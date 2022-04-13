import {
  Column, Entity, ManyToOne, OneToMany,
} from 'typeorm';
import { DatabaseEntityWithID } from './base/DatabaseEntityWithID';
// eslint-disable-next-line import/no-cycle
import { TrackOnPlaylist } from './TrackOnPlaylist';
import { User } from './User';

/**
 * Visibility of user playlists
 */
export enum PlaylistVisibility {
  Public = 'public',
  Private = 'private',
}

@Entity()
export class Playlist extends DatabaseEntityWithID {
  @Column({ type: 'varchar' })
    name!: string;

  @Column({ type: 'varchar', default: '', nullable: true })
    description?: string;

  @ManyToOne(() => User)
    owner!: User;

  @OneToMany(() => TrackOnPlaylist, (trackOnPlaylist) => trackOnPlaylist.playlist)
    tracks!: TrackOnPlaylist[];

  @Column({ type: 'enum', enum: PlaylistVisibility, default: PlaylistVisibility.Private })
    visibility!: PlaylistVisibility;
}
