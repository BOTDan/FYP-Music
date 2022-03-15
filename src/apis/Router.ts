import { Router } from 'express';
import { YouTubeAPI } from './providers/YouTube';

const apiRouter = Router();

const youtubeAPI = new YouTubeAPI();
apiRouter.use('/youtube', youtubeAPI.router);

export default apiRouter;
