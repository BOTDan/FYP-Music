import { Router } from 'express';
import passport from 'passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { getConnection, getCustomRepository } from 'typeorm';
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
  if (account) {
    // Account with given Google ID was found
    done(null, account, 'Found');
  } else {
    // No account was found with this Google ID, create a new user with account attached
    const newAccount = await createAccountAndUser(id, displayName);
    done(null, newAccount, 'Created');
  }
}

const strategy = new Strategy({
  clientID: config.GOOGLE_CLIENT_ID,
  clientSecret: config.GOOGLE_CLIENT_SECRET,
  callbackURL: callbackUrl,
  scope: scopes,
}, verifyUser);

passport.use(strategy);

const router = Router();

router.get(
  '/',
  passport.authenticate('google', { session: false }),
);

router.get(
  '/callback',
  passport.authenticate('google', { session: false }),
  (request, response) => {
    console.log(request.authInfo);
    console.log(request.user);
    response.send(request.user);
  },
);

export default router;
