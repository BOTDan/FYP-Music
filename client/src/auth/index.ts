import { authFetchCatchFail } from '../apis';
import { AppDispatch } from '../store/helper';
import { updateToken } from '../store/reducers/auth';
import { StoreObjectState } from '../types';
import {
  AuthAccountDTO, AuthAccountLinkTokenDTO, AuthProvider, UserTokenDTO,
} from '../types/public';

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

/**
 * Generates a link token via the API. This needs simplifying on the server.
 * @param provider The auth provider
 * @param code The callback code from successful OAuth login
 * @returns An AuthAccountLinkToken that can be used to link an account
 */
export async function generateLinkToken(provider: AuthProvider, code: string) {
  const response = await fetch(`/auth/${provider}/link/callback?code=${code}&state=link`);
  if (!response.ok) {
    throw new Error('Failed to link account');
  }
  const data = await response.json();
  return data as AuthAccountLinkTokenDTO;
}

/**
 * Attepts to link an auth account to this account
 * @param linkToken The link token of the account to link
 * @param token The user token
 * @returns The newly linked auth account
 */
export async function linkAccount(linkToken: AuthAccountLinkTokenDTO, token: UserTokenDTO) {
  const result = await authFetchCatchFail('/auth/link', token, {
    method: 'POST',
    body: JSON.stringify({
      token: linkToken.token,
    }),
  });
  return result as AuthAccountDTO;
}

/**
 * Unlinks an account from the user
 * @param authAccount The auth account to unlink
 * @param token The user token
 */
export async function unlinkAccount(authAccount: AuthAccountDTO, token: UserTokenDTO) {
  await authFetchCatchFail(`/auth/accounts/${authAccount.id}`, token, {
    method: 'DELETE',
  });
}

/**
 * Logs out the given user token
 * @param token The user token
 */
export async function logout(token: UserTokenDTO) {
  await authFetchCatchFail('/auth/logout/', token, {
    method: 'POST',
  });
}

/**
 * Gets the users linked auth accounts
 * @param token The user token
 * @returns A list of auth accounts
 */
export async function getAuthAccounts(token: UserTokenDTO): Promise<AuthAccountDTO[]> {
  return authFetchCatchFail('/auth/accounts', token);
}
