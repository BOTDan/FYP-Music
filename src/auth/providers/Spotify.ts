import { Request } from 'express';
import passport from 'passport';
import { Strategy, Profile, VerifyCallback } from 'passport-spotify';
import { config } from '../../config';
import { AuthProvider } from '../../entities/AuthAccount';
import { AuthInfo, BaseAuthProvider } from './base';

export class SpotifyAuthProvider extends BaseAuthProvider {
  constructor() {
    super('spotify', AuthProvider.Spotify);

    const callbackUrl = 'http://localhost:8080/auth/spotify/callback';

    const strategy = new Strategy({
      clientID: config.SPOTIFY_CLIENT_ID,
      clientSecret: config.SPOTIFY_CLIENT_SECRET,
      callbackURL: callbackUrl,
      passReqToCallback: true,
    }, this.processAuthInfo.bind(this));

    passport.use(strategy);

    this.handleLoginRequest = passport.authenticate('spotify', { session: false, failWithError: true, state: 'login' });
    this.handleLoginCallback = passport.authenticate('spotify', { session: false, failWithError: true, state: 'login' });
    this.handleLinkRequest = passport.authenticate('spotify', { session: false, failWithError: true, state: 'link' });
    this.handleLinkCallback = passport.authenticate('spotify', { session: false, failWithError: true, state: 'link' });
  }

  /**
   * Processes user information after they've completed oauth login
   * @param request The Express request object
   * @param accessToken The access token from oauth
   * @param refreshToken The refresh token from oauth
   * @param expires The time to expiry
   * @param profile User information
   * @param done Callback function
   */
  override processAuthInfo(
    request: Request,
    accessToken: string,
    refreshToken: string,
    expires: number,
    profile: Profile,
    done: VerifyCallback,
  ): void {
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
