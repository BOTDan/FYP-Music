/* eslint-disable no-param-reassign */
import { AbstractRepository, EntityRepository } from 'typeorm';
import { Playlist } from '../entities/Playlist';
import { User } from '../entities/User';
import { PlaylistVisibility } from '../types/public';

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
    const relations = ['owner'];
    if (includeTracks) { relations.push('tracks', 'tracks.playlist', 'tracks.addedBy', 'tracks.track', 'tracks.track.artists'); }
    return this.repository.find({ where: { owner: user }, order: { dateCreated: 'DESC' }, relations });
  }

  /**
   * Gets a playlist with the given ID
   * @param id The id of the playlist
   * @param includeTracks If tracks should be included in the result
   * @returns A playlist
   */
  getPlaylist(id: string, includeTracks = false) {
    const relations = ['owner'];
    if (includeTracks) { relations.push('tracks', 'tracks.playlist', 'tracks.addedBy', 'tracks.track', 'tracks.track.artists'); }
    return this.repository.findOne({ where: { id }, relations });
  }

  /**
   * Updates a playlist in the database
   * @param playlist The playlist to update
   * @param options The parameters to update
   * @returns The updated playlist
   */
  updatePlaylist(playlist: Playlist, options: Partial<PlaylistData>) {
    playlist.name = options.name ?? playlist.name;
    playlist.description = options.description ?? playlist.description;
    playlist.visibility = options.visibility ?? playlist.visibility;
    return this.repository.save(playlist);
  }

  /**
   * Returns the owner of a playlist
   * @param playlist The playlist
   * @returns The owner of the playlist, or undefined if the playlist does not exist
   */
  async getPlaylistOwner(playlist: Playlist) {
    return (await this.repository.findOne({ where: { id: playlist.id }, relations: ['owner'] }))?.owner;
  }
}
