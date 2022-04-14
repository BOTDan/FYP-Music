import {
  Column, Entity, ManyToOne, OneToMany,
} from 'typeorm';
import { PlaylistDTO, PlaylistVisibility } from '../types/public';
import { DatabaseEntityWithID } from './base/DatabaseEntityWithID';
// eslint-disable-next-line import/no-cycle
import { TrackOnPlaylist } from './TrackOnPlaylist';
import { User } from './User';

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

  public get dto(): PlaylistDTO {
    return {
      name: this.name,
      description: this.description,
      owner: this.owner.dto,
      tracks: this.tracks.map((track) => track.dto),
      visibility: this.visibility,
    };
  }
}
