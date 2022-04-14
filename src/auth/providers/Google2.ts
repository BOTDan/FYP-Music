import passport from 'passport';
import { Request } from 'express';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { google } from 'googleapis';
import { OAuth2Client } from 'googleapis-common';
import { config } from '../../config';
import { AuthInfo, AuthInfoTokens, BaseAuthProvider } from './base';
import { AuthProvider } from '../../types/public';

/**
 * Provides logins for Google auth.
 */
export class GoogleAuthProvider extends BaseAuthProvider {
  api: OAuth2Client;

  constructor() {
    super('google', AuthProvider.Google);

    // const callbackUrl = 'http://localhost:8080/auth/google/callback';
    const callbackUrl = 'http://localhost:3000/callback/google';
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

    this.api = new google.auth.OAuth2({
      clientId: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      redirectUri: callbackUrl,
    });
  }

  handleLoginRequest = passport.authenticate('google', {
    accessType: 'offline', session: false, failWithError: true, state: 'login',
  });

  handleLoginCallback = passport.authenticate('google', {
    accessType: 'offline', session: false, failWithError: true, state: 'login',
  });

  handleLinkRequest = passport.authenticate('google', {
    accessType: 'offline', session: false, failWithError: true, state: 'link',
  });

  handleLinkCallback = passport.authenticate('google', {
    accessType: 'offline', session: false, failWithError: true, state: 'link',
  });

  /**
   * Processes user information after they've completed oauth login
   * @param request The Express request object
   * @param accessToken The access token from oauth
   * @param refreshToken The refresh token from oauth
   * @param profile User information
   * @param done Callback function
   */
  processAuthInfo(
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

  async getNewTokens(refreshToken: string): Promise<AuthInfoTokens> {
    try {
      console.log('Refreshing credentials');

      this.api.setCredentials({
        refresh_token: refreshToken,
      });
      const result = await this.api.refreshAccessToken();
      if (!result.credentials.access_token) {
        throw new Error('Tokens failed to refresh');
      }
      const tokens: AuthInfoTokens = {
        accessToken: result.credentials.access_token,
        refreshToken: result.credentials.refresh_token ?? undefined,
      };
      console.log('Refreshed tokens');
      console.log(tokens);

      return tokens;
    } finally {
      this.api.setCredentials({});
    }
  }
}

const googleAuthProvider = new GoogleAuthProvider();
export default googleAuthProvider;
