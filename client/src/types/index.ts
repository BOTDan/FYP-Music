export enum MediaProvider {
  YouTube = 'youtube',
  Spotify = 'spotify',
  SoundCloud = 'soundcloud',
}

export interface ExternalArtist {
  name: string;
  image?: string;
  provider: MediaProvider;
  providerId: string;
}

export interface ExternalTrack {
  name: string;
  duration: number;
  artists: ExternalArtist[];
  image?: string;
  provider: MediaProvider;
  providerId: string;
}
