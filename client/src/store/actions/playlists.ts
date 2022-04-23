import {
  addTrackToPlaylist,
  createPlaylist, getMyPlaylists, getPlaylist, PlaylistOptions, removeTrackFromPlaylist,
} from '../../apis/playlists';
import { StoreObjectState } from '../../types';
import {
  ExternalTrack, PlaylistDTO, TrackOnPlaylistDTO, UserTokenDTO,
} from '../../types/public';
import { AppDispatch } from '../helper';
import {
  addPersonalPlaylistToStore, addTrackToPlaylistInStore,
  removeTrackFromPlaylistInStore,
  updatePersonalPlaylistsInStore, updatePlaylistInStore,
} from '../reducers/playlists2';

/**
 * Gets the users playlists
 * @param token The user token
 * @param dispatch The appDispatch function
 * @returns A list of playlists
 */
export async function getMyPlaylistsToStore(
  token: UserTokenDTO | undefined,
  dispatch: AppDispatch,
): Promise<PlaylistDTO[]> {
  if (!token) {
    dispatch(updatePersonalPlaylistsInStore({
      state: StoreObjectState.Error,
      error: 'Not logged in',
    }));
    throw new Error('Not logged in');
  }
  dispatch(updatePersonalPlaylistsInStore({
    state: StoreObjectState.Loading,
  }));
  try {
    const result = await getMyPlaylists(token);
    dispatch(updatePersonalPlaylistsInStore({
      state: StoreObjectState.Loaded,
      value: result,
    }));
    return result;
  } catch (e) {
    dispatch(updatePersonalPlaylistsInStore({
      state: StoreObjectState.Error,
      error: 'error',
    }));
    throw e;
  }
}

/**
 * Gets a playlist from the API and saves it to the store
 * @param id The id of the playlist to get
 * @param token The user token
 * @param dispatch The appDispatch function
 * @returns The playlist
 */
export async function getPlaylistToStore(
  id: string,
  token: UserTokenDTO | undefined,
  dispatch: AppDispatch,
): Promise<PlaylistDTO> {
  dispatch(updatePlaylistInStore({
    id,
    value: {
      state: StoreObjectState.Loading,
    },
  }));
  try {
    const result = await getPlaylist(id, token);
    dispatch(updatePlaylistInStore({
      id,
      value: {
        state: StoreObjectState.Loaded,
        value: result,
      },
    }));
    return result;
  } catch (e) {
    dispatch(updatePlaylistInStore({
      id,
      value: {
        state: StoreObjectState.Error,
        error: 'error',
      },
    }));
    throw e;
  }
}

/**
 * Creates a playlist for a user and saves it to the store
 * @param options The options for the playlist
 * @param token The user token
 * @param dispatch The appDispatch function
 * @returns The created playlist
 */
export async function createPlaylistToStore(
  options: PlaylistOptions,
  token: UserTokenDTO | undefined,
  dispatch: AppDispatch,
): Promise<PlaylistDTO> {
  const result = await createPlaylist(options, token);
  dispatch(addPersonalPlaylistToStore(result));
  return result;
}

export async function addTrackToPlaylistToStore(
  playlist: PlaylistDTO,
  track: ExternalTrack,
  token: UserTokenDTO | undefined,
  dispatch: AppDispatch,
) {
  const result = await addTrackToPlaylist(playlist, track, token);
  dispatch(addTrackToPlaylistInStore(result));
}

export async function removeTrackFromPlaylistToStore(
  playlist: PlaylistDTO,
  track: TrackOnPlaylistDTO,
  token: UserTokenDTO | undefined,
  dispatch: AppDispatch,
) {
  await removeTrackFromPlaylist(playlist, track, token);
  dispatch(removeTrackFromPlaylistInStore(track));
}
