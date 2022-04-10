import {
  Column, Entity, ManyToOne,
} from 'typeorm';
import { DatabaseEntityWithID } from './base/DatabaseEntityWithID';
import { Playlist } from './Playlist';
import { Track } from './Track';
import { User } from './User';

@Entity()
export class TrackOnPlaylist extends DatabaseEntityWithID {
  @ManyToOne(() => Track)
    track!: Track;

  @ManyToOne(() => Playlist)
    playlist!: Playlist;

  @Column({ type: 'int' })
    order!: number;

  @ManyToOne(() => User)
    addedBy!: User;
}
