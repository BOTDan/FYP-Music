import { authFetchCatchFail } from '../apis';
import { AppDispatch } from '../store/helper';
import { updateToken } from '../store/reducers/auth';
import { StoreObjectState } from '../types';
import { AuthProvider, UserTokenDTO } from '../types/public';

/**
 * Attepts to exchange a login code for an auth token from our server
 * @param provider The auth provider to use
 * @param code The callback code from successful OAuth login
 * @returns A UserTokenDTO if successfully logged in
 */
export async function login(provider: AuthProvider, code: string, dispatch?: AppDispatch) {
  const response = await fetch(`/auth/${provider}/login/callback?code=${code}&state=login`);
  if (!response.ok) {
    if (dispatch) {
      dispatch(updateToken({
        state: StoreObjectState.Error,
        error: 'Failed to log in',
        value: undefined,
      }));
    }
    throw new Error('Failed to log in');
  }
  const data = await response.json();
  if (dispatch) {
    dispatch(updateToken({
      state: StoreObjectState.Loaded,
      value: data,
    }));
  }
  return data as UserTokenDTO;
}

/**
 * Gets an access token for the given auth provider
 * @param provider The provider to get the access token from
 * @param token The user login token
 * @returns The access token from the server
 */
export async function getAccessToken(provider: AuthProvider, token: UserTokenDTO) {
  const result = await authFetchCatchFail(`/auth/${provider}/accesstoken`, token);
  console.log(result);
  return result.accessToken;
}
