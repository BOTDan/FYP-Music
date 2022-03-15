import { Router } from 'express';
import { SpotifyAPI } from './providers/Spotify';
import { YouTubeAPI } from './providers/YouTube';

const apiRouter = Router();

const youtubeAPI = new YouTubeAPI();
apiRouter.use('/youtube', youtubeAPI.router);

const spotifyAPI = new SpotifyAPI();
apiRouter.use('/spotify', spotifyAPI.router);

export default apiRouter;
