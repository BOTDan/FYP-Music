import { AbstractRepository, EntityRepository } from 'typeorm';
import { Playlist, PlaylistVisibility } from '../entities/Playlist';
import { User } from '../entities/User';

export interface PlaylistData {
  name: string;
  description?: string;
  owner: User;
  visibility?: PlaylistVisibility
}

@EntityRepository(Playlist)
export class PlaylistRepository extends AbstractRepository<Playlist> {
  /**
   * Creates a playlist in the database
   * @param options The playlist options
   * @returns The cretaed playlist
   */
  createPlaylist(options: PlaylistData) {
    const playlist = new Playlist();
    playlist.name = options.name;
    playlist.description = options.description;
    playlist.owner = options.owner;
    playlist.visibility = options.visibility ?? PlaylistVisibility.Private;
    return this.repository.save(playlist);
  }

  /**
   * Returns a list of playlists owned by the user
   * @param user The playlists owner
   * @returns A list of playlists
   */
  getUserPlaylists(user: User, includeTracks = false) {
    const relations = (includeTracks) ? ['tracks'] : [];
    return this.repository.find({ where: { owner: user }, relations });
  }

  /**
   * Gets a playlist with the given ID
   * @param id The id of the playlist
   * @param includeTracks If tracks should be included in the result
   * @returns A playlist
   */
  getPlaylist(id: string, includeTracks = false) {
    const relations = (includeTracks) ? ['tracks'] : [];
    return this.repository.findOne({ where: { id }, relations });
  }
}
