import passport from 'passport';
import { Request } from 'express';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { config } from '../../config';
import { AuthProvider } from '../../entities/AuthAccount';
import { AuthInfo, BaseAuthProvider } from './base';

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

    this.handleLoginRequest = passport.authenticate('google', {
      accessType: 'offline', session: false, failWithError: true, state: 'login',
    });
    this.handleLoginCallback = passport.authenticate('google', {
      accessType: 'offline', session: false, failWithError: true, state: 'login',
    });
    this.handleLinkRequest = passport.authenticate('google', {
      accessType: 'offline', session: false, failWithError: true, state: 'link',
    });
    this.handleLinkCallback = passport.authenticate('google', {
      accessType: 'offline', session: false, failWithError: true, state: 'link',
    });
  }

  /**
   * Processes user information after they've completed oauth login
   * @param request The Express request object
   * @param accessToken The access token from oauth
   * @param refreshToken The refresh token from oauth
   * @param profile User information
   * @param done Callback function
   */
  override processAuthInfo(
    request: Request,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    const userInfo = this.extractUserInfo(profile);
    const tokens = { accessToken, refreshToken };
    const info = {
      provider: this.provider,
      id: userInfo.id,
      tokens,
      userInfo,
    } as AuthInfo;
    done(null, userInfo, info);
  }
}
