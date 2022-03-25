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
