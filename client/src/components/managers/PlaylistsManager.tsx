import { useEffect } from 'react';
import { getMyPlaylistsToStore } from '../../store/actions/playlists';
import { useAppAuthToken, useAppDispatch } from '../../store/helper';

/**
 * A playlist store manager, handles getting users playlists
 * THERE SHOULD ONLY EVER BE 1 OF THESE
 * @returns A playlist store manager
 */
export function PlaylistsManager() {
  const dispatch = useAppDispatch();
  const userToken = useAppAuthToken();

  // Runs every time the user token is updated
  // Gets the users playlists
  useEffect(() => {
    getMyPlaylistsToStore(userToken, dispatch)
      .catch(() => null);
  }, [userToken]);

  // Runs when something wants to display the add track to playlist popup
  return (null);
}
