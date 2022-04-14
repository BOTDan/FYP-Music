import { Request } from 'express';
import passport from 'passport';
import { Strategy, Profile, VerifyCallback } from 'passport-spotify';
import SpotifyWebApi from 'spotify-web-api-node';
import { config } from '../../config';
import { AuthProvider } from '../../types/public';
import { AuthInfo, AuthInfoTokens, BaseAuthProvider } from './base';

export class SpotifyAuthProvider extends BaseAuthProvider {
  api: SpotifyWebApi;

  constructor() {
    super('spotify', AuthProvider.Spotify);

    // const callbackUrl = 'http://localhost:8080/auth/spotify/callback';
    const callbackUrl = 'http://localhost:3000/callback/spotify';

    const strategy = new Strategy({
      clientID: config.SPOTIFY_CLIENT_ID,
      clientSecret: config.SPOTIFY_CLIENT_SECRET,
      callbackURL: callbackUrl,
      passReqToCallback: true,
    }, this.processAuthInfo.bind(this));

    passport.use(strategy);

    this.api = new SpotifyWebApi({
      clientId: config.SPOTIFY_CLIENT_ID,
      clientSecret: config.SPOTIFY_CLIENT_SECRET,
    });
  }

  handleLoginRequest = passport.authenticate('spotify', { session: false, failWithError: true, state: 'login' });
  handleLoginCallback = passport.authenticate('spotify', { session: false, failWithError: true, state: 'login' });
  handleLinkRequest = passport.authenticate('spotify', { session: false, failWithError: true, state: 'link' });
  handleLinkCallback = passport.authenticate('spotify', { session: false, failWithError: true, state: 'link' });

  /**
   * Processes user information after they've completed oauth login
   * @param request The Express request object
   * @param accessToken The access token from oauth
   * @param refreshToken The refresh token from oauth
   * @param expires The time to expiry
   * @param profile User information
   * @param done Callback function
   */
  processAuthInfo(
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

  async getNewTokens(refreshToken: string): Promise<AuthInfoTokens> {
    this.api.setRefreshToken(refreshToken);
    try {
      const result = await this.api.refreshAccessToken();
      if (!result.body || !result.body.access_token) {
        throw new Error('Tokens failed to refresh');
      }
      const tokens: AuthInfoTokens = {
        accessToken: result.body.access_token,
        refreshToken: result.body.refresh_token,
      };
      return tokens;
    } finally {
      this.api.resetRefreshToken();
    }
  }
}
const spotifyAuthProvider = new SpotifyAuthProvider();
export default spotifyAuthProvider;
