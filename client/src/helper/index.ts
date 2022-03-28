import { MediaProvider } from '../types';

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

const prettyNames: { [provider in MediaProvider]: string } = {
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
  return prettyNames[provider];
}
