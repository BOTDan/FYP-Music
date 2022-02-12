import {
  NextFunction, Request, Response, Router,
} from 'express';
import passport from 'passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { getConnection, getCustomRepository } from 'typeorm';
import { issueToken } from '..';
import { config } from '../../config';
import { AuthProvider } from '../../entities/AuthAccount';
import { AuthAccountRepository } from '../../repositories/AuthAccountRepository';
import { UserRepository } from '../../repositories/UserRepository';

const callbackUrl = 'http://localhost:8080/auth/google/callback';
const scopes = [
  'https://www.googleapis.com/auth/youtube.readonly',
  'https://www.googleapis.com/auth/userinfo.profile',
];

/**
 * Attempts to find the given account/user from the Google ID
 * @param id The Google ID of the account
 * @returns The account, if found
 */
async function getAuthAccount(id: string) {
  const repo = getCustomRepository(AuthAccountRepository);
  const account = await repo.findByAuthId(AuthProvider.Google, id);
  return account;
}

/**
 * Creates a new user, and attaches a new auth account to it.
 * @param id The google account ID
 * @param displayName The display name of the new user
 * @returns An AuthAccount attached to the new user
 */
async function createAccountAndUser(id: string, displayName: string) {
  const connection = getConnection();
  return connection.transaction(async (entityManager) => {
    const userRepo = entityManager.getCustomRepository(UserRepository);
    const user = await userRepo.createUser(displayName);

    const authRepo = entityManager.getCustomRepository(AuthAccountRepository);
    const authAccount = await authRepo.createGoogleAccount(id, user);

    return authAccount;
  });
}

/**
 * Verifies if the user attempting to log in has an account.
 * @param accessToken The access token from google
 * @param refreshToken The refresh token from google
 * @param profile User information about google
 * @param done callback function
 */
async function verifyUser(
  accessToken: string,
  refreshToken: string,
  profile: Profile,
  done: VerifyCallback,
) {
  const { id, displayName } = profile;
  const account = await getAuthAccount(id);
  const tokens = {
    accessToken, refreshToken,
  };
  if (account) {
    // Account with given Google ID was found
    done(null, account.user, tokens);
  } else {
    // No account was found with this Google ID, create a new user with account attached
    const newAccount = await createAccountAndUser(id, displayName);
    done(null, newAccount.user, tokens);
  }
}

// Create a new Google auth strategy
const strategy = new Strategy({
  clientID: config.GOOGLE_CLIENT_ID,
  clientSecret: config.GOOGLE_CLIENT_SECRET,
  callbackURL: callbackUrl,
  scope: scopes,
}, verifyUser);
passport.use(strategy);

// Set up the router
const router = Router();

/**
 * Route for redirecting users to the Google login page
 */
router.get(
  '/',
  passport.authenticate('google', { session: false, failWithError: true }),
);

/**
 * Callback route for when a user has gone through the auth steps.
 */
router.get(
  '/callback',
  // Do google authentication
  passport.authenticate('google', { session: false, failWithError: true }),
  // Handle what happens when the user has successfully gone through authentication
  // TODO: Move to own function
  async (request: Request, response: Response) => {
    if (request.user) {
      // We have a user, create a token for them
      const token = await issueToken(request.user);
      response.send(token);
    } else {
      response.send('Failed');
    }
  },
  // Handles what happens when a user fails to get through authentication
  // TODO: Move to own function
  (err: string, request: Request, response: Response, _next: NextFunction) => {
    response.send('An error occured');
  },
);

export default router;
