import {
  Column, Entity, ManyToOne,
} from 'typeorm';
import { TrackOnPlaylistDTO } from '../types/public';
import { DatabaseEntityWithID } from './base/DatabaseEntityWithID';
// eslint-disable-next-line import/no-cycle
import { Playlist } from './Playlist';
import { Track } from './Track';
import { User } from './User';

@Entity()
export class TrackOnPlaylist extends DatabaseEntityWithID {
  @ManyToOne(() => Track)
    track!: Track;

  @ManyToOne(() => Playlist, (playlist) => playlist.tracks)
    playlist!: Playlist;

  @Column({ type: 'int' })
    order!: number;

  @ManyToOne(() => User)
    addedBy!: User;

  public get dto(): TrackOnPlaylistDTO {
    return {
      id: this.id,
      track: this.track?.dto,
      playlist: {
        id: this.playlist?.id,
      },
      order: this.order,
      addedBy: this.addedBy?.dto,
    };
  }
}
