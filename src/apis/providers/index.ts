import { ExternalAPI, MediaProvider } from './base';
import spotifyAPI from './Spotify';
import youtubeAPI from './YouTube';

export const externalAPIs: { [key in MediaProvider]: ExternalAPI | undefined } = {
  [MediaProvider.YouTube]: youtubeAPI,
  [MediaProvider.Spotify]: spotifyAPI,
  [MediaProvider.SoundCloud]: undefined,
};
