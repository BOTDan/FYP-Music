import {
  Column, Entity, ManyToOne,
} from 'typeorm';
import { DatabaseEntityWithID } from './base/DatabaseEntityWithID';
// eslint-disable-next-line import/no-cycle
import { Playlist } from './Playlist';
import { Track, TrackDTO } from './Track';
import { User, UserDTO } from './User';

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
      track: this.track.dto,
      playlist: {
        id: this.playlist.id,
      },
      order: this.order,
      addedBy: this.addedBy?.dto,
    };
  }
}

export interface TrackOnPlaylistDTO {
  id: string;
  track: TrackDTO;
  playlist: {
    id: string;
  }
  order: number;
  addedBy?: UserDTO;
}
