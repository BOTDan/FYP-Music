import { AuthProvider, MediaProvider } from '../types/public';

/**
 * Converts a provider string to an enum
 * @param provider The string enum of the provider
 * @returns A MediaProvider if valid, else undefined
 */
export function mediaProviderFromString(provider: string) {
  const lower = provider.toLowerCase();
  const finalProvider = (Object.values(MediaProvider).includes(lower as MediaProvider))
    ? lower as MediaProvider
    : undefined;
  return finalProvider;
}

const prettyMediaNames: { [provider in MediaProvider]: string } = {
  [MediaProvider.YouTube]: 'YouTube',
  [MediaProvider.Spotify]: 'Spotify',
  [MediaProvider.SoundCloud]: 'SoundCloud',
};
/**
 * Returns the pretty string version of the given provider enum
 * @param provider The provider enum
 * @returns A pretty string version of the provider
 */
export function mediaProviderPrettyPrint(provider: MediaProvider) {
  return prettyMediaNames[provider];
}

const prettyAuthNames: { [provider in AuthProvider]: string } = {
  [AuthProvider.Spotify]: 'Spotify',
  [AuthProvider.Google]: 'Google',
};
/**
 * Returns the pretty string version of the given provider enum
 * @param provider The provider enum
 * @returns A pretty string version of the provider
 */
export function authProviderPrettyPrint(provider: AuthProvider) {
  return prettyAuthNames[provider];
}

/**
 * Converts a time in ms to (h:m)m:ss format
 * @param time The time in ms
 * @returns An easy-to-read time string
 */
export function formatTime(time: number) {
  // Time is in ms
  const hours = Math.floor(time / (1000 * 60 * 60));
  const hoursRemainder = time % (1000 * 60 * 60);
  const minutes = Math.floor(hoursRemainder / (1000 * 60));
  const minutesRemainder = hoursRemainder % (1000 * 60);
  const seconds = Math.floor(minutesRemainder / 1000);
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
