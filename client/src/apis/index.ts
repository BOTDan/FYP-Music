import { UserTokenDTO } from '../types';

/**
 * Makes an authenticated fetch request
 * @param url The url to fetch from
 * @param token The token to use for auth
 * @param options Any more request options
 * @returns The fetch request
 */
export function authFetch(url: string, token?: UserTokenDTO, options?: RequestInit) {
  const headers: HeadersInit = {};
  if (token && token.token.length > 0) {
    headers.authorization = `Bearer ${token.token}`;
  }
  return fetch(url, { headers, ...options });
}
