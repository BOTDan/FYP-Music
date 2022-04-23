import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import store from '.';

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/**
 * Gets the users login token from the store
 */
export function useAppAuthToken() {
  return useAppSelector((state) => state.auth.token.value);
}

/**
 * Gets the logged in users playlists from the store
 */
export function useAppPersonalPlaylists() {
  return useAppSelector((state) => ({
    state: state.playlists.personal.state,
    error: state.playlists.personal.error,
    value: state.playlists.personal.value?.map(
      (playlist) => state.playlists.all[playlist].value!,
    ) ?? [],
  }));
}

/**
 * Gets a specific playlist from the store
 * @param id The id of the playlist
 */
export function useAppPlaylist(id: string) {
  return useAppSelector((state) => state.playlists.all[id]);
}
