import { Router } from 'express';
import { deleteToken, requireAuthentication } from '.';
import googleAuthRouter from './providers/Google';

const authRouter = Router();

// Include Google auth routes
authRouter.use('/google', googleAuthRouter);

// Home route, goes nowhere
authRouter.get('/', (request, response) => {
  response.send('This does nothing');
});

// Test route for checking requireAuthentication
authRouter.get('/test', requireAuthentication, (request, response) => {
  console.log(request.token);
  console.log(request.user);

  response.send('You are authenticated');
});

// Route to delete the token in the auth header
authRouter.post('/logout', requireAuthentication, async (request, response) => {
  if (request.token) {
    const token = await deleteToken(request.token);
    console.log(token);
    response.send('Logged out');
  } else {
    response.send('Failed to log out, no token to delete');
  }
});

export default authRouter;
