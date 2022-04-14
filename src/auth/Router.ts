import { Router } from 'express';
import { deleteToken, linkAccount, requireAuthentication } from '.';
import { BadRequestError, NotAuthenticatedError } from '../errors/httpstatus';
// import googleAuthRouter from './providers/Google';
import googleAuthProvider from './providers/Google2';
import spotifyAuthProvider from './providers/Spotify';

const authRouter = Router();

// Include Google auth routes
// authRouter.use('/google', googleAuthRouter);

authRouter.use('/google', googleAuthProvider.router);

authRouter.use('/spotify', spotifyAuthProvider.router);

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
authRouter.post('/logout', requireAuthentication, async (request, response, next) => {
  if (request.token) {
    const token = await deleteToken(request.token);
    console.log(token);
    response.send('Logged out');
  } else {
    next(new NotAuthenticatedError());
  }
});

// Route to link an account to another account
authRouter.post('/link', requireAuthentication, async (request, response, next) => {
  try {
    if (!request.token || !request.token.user) { throw new NotAuthenticatedError(); }
    const { token } = request.body;
    if (!token) { throw new BadRequestError('Parameter \'token\' is missing from JSON post body.'); }
    const authAccount = await linkAccount(request.token?.user, token);
    response.send(authAccount.dto);
  } catch (e) {
    next(e);
  }
});

export default authRouter;
