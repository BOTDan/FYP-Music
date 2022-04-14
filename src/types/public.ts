/**
 * These types may be returned to the user.
 * Everything in this file should be self-contained (no imports).
 * This way, this file can be used on the client as well.
 */

/**
 * The external API provider
 */
export enum MediaProvider {
  Spotify = 'spotify',
  YouTube = 'youtube',
  SoundCloud = 'soundcloud',
}

/**
 * Auth providers
 */
export enum AuthProvider {
  Spotify = 'spotify',
  Google = 'google',
}

/**
 * Visibility of user playlists
 */
export enum PlaylistVisibility {
  Public = 'public',
  Private = 'private',
}

/**
 * Search param types
 */
export interface PaginationParams {
  page: number;
}
export interface SearchParams extends Partial<PaginationParams> {
  q: string;
}
export interface TrackSearchParams extends SearchParams { }
export interface PlaylistSearchParams extends SearchParams { }

/**
 * External resources from external APIs
 * <----------------------------------->
 */

/**
 * Properties all external resources have
 */
export interface ExternalResource {
  provider: MediaProvider;
  providerId: string;
}

/**
 * An artist from an external API
 */
export interface ExternalArtist extends ExternalResource {
  name: string;
  image?: string;
}

/**
 * A track from an external API
 */
export interface ExternalTrack extends ExternalResource {
  name: string;
  duration: number;
  artists: ExternalArtist[];
  image?: string;
}

/**
 * A playlist from an external API
 */
export interface ExternalPlaylist extends ExternalResource {
  name: string;
  description: string;
  tracks?: ExternalTrack[];
  image?: string;
}

/**
 * Data Transfer Objects
 * <------------------->
 */

/**
 * DTO for AuthAccount
 */
export interface AuthAccountDTO {
  provider: AuthProvider;
  authId: string;
}

/**
 * DTO for AuthAccountLinkToken
 */
export interface AuthAccountLinkTokenDTO {
  token: string;
}

/**
 * DTO for User
 */
export interface UserDTO {
  id: string;
  displayName: string;
}

/**
 * DTO for UserToken
 */
export interface UserTokenDTO {
  token: string;
  user: UserDTO;
}

/**
 * DTO for TrackOnPlaylist
 */
export interface TrackOnPlaylistDTO {
  id: string;
  track: ExternalTrack;
  playlist: {
    id: string;
  }
  order: number;
  addedBy?: UserDTO;
}

/**
 * DTO for Playlist
 */
export interface PlaylistDTO {
  id: string;
  name: string;
  description?: string;
  owner: UserDTO;
  tracks: TrackOnPlaylistDTO[];
  visibility: PlaylistVisibility;
}
