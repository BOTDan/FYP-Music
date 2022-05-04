import { AbstractRepository, EntityRepository } from 'typeorm';
import { Playlist } from '../entities/Playlist';
import { Track } from '../entities/Track';
import { TrackOnPlaylist } from '../entities/TrackOnPlaylist';

@EntityRepository(TrackOnPlaylist)
export class TrackOnPlaylistRepository extends AbstractRepository<TrackOnPlaylist> {
  /**
   * Adds a track to a playlist
   * @param playlist The playlist to add to
   * @param track The track to add
   * @returns The track in playlist object
   */
  addTrackToPlaylist(playlist: Playlist, track: Track) {
    const trackOnPlaylist = new TrackOnPlaylist();
    trackOnPlaylist.track = track;
    trackOnPlaylist.playlist = playlist;
    trackOnPlaylist.order = 0;
    return this.repository.save(trackOnPlaylist);
  }

  /**
   * Finds a track on playlist entry by ID
   * @param id The id of the track on playlist entry
   * @returns The track on playlist
   */
  getTrackInPlaylist(id: string) {
    return this.repository.findOne({ where: { id }, relations: ['playlist', 'track', 'addedBy'] });
  }

  /**
   * Removes a track from a playlist
   * @param trackOnPlaylist The track on playlist to remove
   * @returns The removed track on playlist object
   */
  deleteTrackFromPlaylist(trackOnPlaylist: TrackOnPlaylist) {
    return this.repository.remove(trackOnPlaylist);
  }
}
