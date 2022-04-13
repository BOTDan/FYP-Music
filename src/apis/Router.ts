import { Router } from 'express';
import internalApiRouter from './internal/router';
import spotifyAPI from './providers/Spotify';
import youtubeAPI from './providers/YouTube';

const apiRouter = Router();

apiRouter.use('/youtube', youtubeAPI.router);

apiRouter.use('/spotify', spotifyAPI.router);

apiRouter.use(internalApiRouter);

export default apiRouter;
