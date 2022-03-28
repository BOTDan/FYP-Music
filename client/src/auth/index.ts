import { AuthProvider, UserTokenDTO } from '../types';

/**
 * Attepts to exchange a login code for an auth token from our server
 * @param provider The auth provider to use
 * @param code The callback code from successful OAuth login
 * @returns A UserTokenDTO if successfully logged in
 */
export async function login(provider: AuthProvider, code: string) {
  const response = await fetch(`/auth/${provider}/login/callback?code=${code}&state=login`);
  if (!response.ok) { throw new Error('Failed to log in'); }
  const data = await response.json();
  return data as { token: UserTokenDTO };
}
