import passport from 'passport';
import { Strategy } from 'passport-google-oauth20';
import { config } from '../../config';
import { AuthProvider } from '../../entities/AuthAccount';
import { BaseAuthProvider } from './base';

/**
 * Provides logins for Google auth.
 */
export class GoogleAuthProvider extends BaseAuthProvider {
  constructor() {
    super('google', AuthProvider.Google);

    const callbackUrl = 'http://localhost:8080/auth/google/callback';
    const scopes = [
      'https://www.googleapis.com/auth/youtube.readonly',
      'https://www.googleapis.com/auth/userinfo.profile',
    ];

    const strategy = new Strategy({
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackURL: callbackUrl,
      scope: scopes,
      passReqToCallback: true,
    }, this.processAuthInfo.bind(this));

    passport.use(strategy);

    this.handleLoginRequest = passport.authenticate('google', { session: false, failWithError: true, state: 'login' });
    this.handleLoginCallback = passport.authenticate('google', { session: false, failWithError: true, state: 'login' });
    this.handleLinkRequest = passport.authenticate('google', { session: false, failWithError: true, state: 'link' });
    this.handleLinkCallback = passport.authenticate('google', { session: false, failWithError: true, state: 'link' });
  }
}
