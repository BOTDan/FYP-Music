import { Router } from 'express';
import { param } from 'express-validator';
import {
  deleteToken, getLinkedAccounts, linkAccount, requireAuthentication, unlinkAccount,
} from '.';
import { blockBadRequests } from '../apis/internal';
import { BadRequestError, NotAuthenticatedError, NotFoundError } from '../errors/httpstatus';
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
    if (token) {
      response.sendStatus(204);
    } else {
      next(new NotAuthenticatedError());
    }
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

// Route to get all linked accounts for a user
authRouter.get('/accounts', requireAuthentication, async (request, response, next) => {
  try {
    if (!request.token || !request.token.user) { throw new NotAuthenticatedError(); }
    const accounts = await getLinkedAccounts(request.token.user);
    const accountDTOs = accounts.map((account) => account.dto);
    response.send(accountDTOs);
  } catch (e) {
    next(e);
  }
});

// Route to link an account to another account
authRouter.delete(
  '/accounts/:id',
  requireAuthentication,
  param('id').isString(),
  blockBadRequests,
  async (request, response, next) => {
    try {
      if (!request.token || !request.token.user) { throw new NotAuthenticatedError(); }
      const { id } = request.params;
      if (!id) { throw new BadRequestError('Parameter \'id\' is missing.'); }
      const authAccount = await unlinkAccount(id, request.token.user);
      if (authAccount.affected && authAccount.affected > 0) {
        response.sendStatus(204);
      } else {
        next(new NotFoundError(`No account linked with id ${id}`));
      }
    } catch (e) {
      next(e);
    }
  },
);

export default authRouter;
