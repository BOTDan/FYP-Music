import { Router } from 'express';
import playlistsRouter from './playlists';

const internalApiRouter = Router();

internalApiRouter.use(playlistsRouter);

export default internalApiRouter;
