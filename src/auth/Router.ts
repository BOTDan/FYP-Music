import { Router } from 'express';
import googleAuthRouter from './providers/Google';

const authRouter = Router();

authRouter.use('/google', googleAuthRouter);

authRouter.get('/', (request, response) => {
  response.send('This does nothing');
});

export default authRouter;
