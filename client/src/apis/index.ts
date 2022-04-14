import { UserTokenDTO } from '../types/public';

/**
 * Makes an authenticated fetch request
 * @param url The url to fetch from
 * @param token The token to use for auth
 * @param options Any more request options
 * @returns The fetch request
 */
export function authFetch(url: string, token?: UserTokenDTO, options?: RequestInit) {
  const headers: HeadersInit = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  console.log(token);
  if (token && token.token.length > 0) {
    headers.authorization = `Bearer ${token.token}`;
  }
  return fetch(url, { headers, ...options });
}

/**
 * Makes an authenticated fetch request, throwing an error if the response is not OK
 * @param url The url to fetch from
 * @param token The token to use for auth
 * @param options Any more request options
 * @returns The fetch request
 */
export async function authFetchCatchFail(url: string, token?: UserTokenDTO, options?: RequestInit) {
  const response = await authFetch(url, token, options);
  if (!response.ok) {
    throw new Error('Response not OK');
  }
  if (response.status === 204) {
    return null;
  }
  const data = await response.json();
  return data;
}
