// export enum MediaProvider {
//   YouTube = 'youtube',
//   Spotify = 'spotify',
//   SoundCloud = 'soundcloud',
// }

// export enum AuthProvider {
//   Spotify = 'spotify',
//   Google = 'Google',
// }

// export interface ExternalArtist {
//   name: string;
//   image?: string;
//   provider: MediaProvider;
//   providerId: string;
// }

// export interface ExternalTrack {
//   name: string;
//   duration: number;
//   artists: ExternalArtist[];
//   image?: string;
//   provider: MediaProvider;
//   providerId: string;
// }

// export interface ExternalPlaylist {
//   name: string;
//   description: string;
//   tracks?: ExternalTrack[];
//   image?: string;
//   provider: MediaProvider;
//   providerId: string;
// }

// export interface InternalArtist {
//   id: string;
//   name: string;
//   image?: string;
//   provider: MediaProvider;
//   providerId: string;
// }

// export interface InternalTrack {
//   name: string;
//   duration: number;
//   artists: InternalArtist[];
//   image?: string;
//   provider: MediaProvider;
//   providerId: string;
// }

// export interface InternalPlaylist {
//   id: string;
//   name: string;
//   description?: string;
//   tracks?: TrackOnInternalPlaylist[];
//   image?: string;
// }

// export interface TrackOnInternalPlaylist {
//   id: string;
//   order: string;
//   track: ExternalTrack;
//   playlist?: InternalPlaylist;
// }

// export interface DatabaseEntityDTO {
//   dateCreated: Date;
//   dateUpdated: Date;
// }

// export interface DatabaseEntityWithIDDTO extends DatabaseEntityDTO {
//   id: string;
// }
// export interface UserDTO extends DatabaseEntityWithIDDTO {
//   displayName: string;
// }
// export interface UserTokenDTO extends DatabaseEntityWithIDDTO {
//   user: UserDTO;
//   token: string;
// }

export {};
