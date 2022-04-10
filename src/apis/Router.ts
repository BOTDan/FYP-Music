import { Router } from 'express';
import internalApiRouter from './internal/router';
import { SpotifyAPI } from './providers/Spotify';
import { YouTubeAPI } from './providers/YouTube';

const apiRouter = Router();

const youtubeAPI = new YouTubeAPI();
apiRouter.use('/youtube', youtubeAPI.router);

const spotifyAPI = new SpotifyAPI();
apiRouter.use('/spotify', spotifyAPI.router);

apiRouter.use(internalApiRouter);

export default apiRouter;
