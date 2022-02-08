import { Router } from 'express';
import { googleAuthRouter } from './Google';



export const authRouter = Router();

authRouter.use('/google', googleAuthRouter);

authRouter.get('/', (request, response) => {
  response.send('This does nothing');
});
