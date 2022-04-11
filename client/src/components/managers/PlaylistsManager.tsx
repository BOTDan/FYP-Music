import { useEffect } from 'react';
import { getMyPlaylists } from '../../apis/playlists';
import { useAppDispatch, useAppSelector } from '../../store/helper';
import { updateLoadingPlaylists, updatePlaylists } from '../../store/reducers/playlists';

/**
 * A playlist store manager, handles getting users playlists
 * THERE SHOULD ONLY EVER BE 1 OF THESE
 * @returns A playlist store manager
 */
export function PlaylistsManager() {
  const userToken = useAppSelector((state) => state.auth.token);
  const dispatch = useAppDispatch();

  // Runs every time the user token is updated
  // Gets the users playlists
  useEffect(() => {
    if (userToken) {
      dispatch(updateLoadingPlaylists(true));

      getMyPlaylists(userToken)
        .then((r) => {
          dispatch(updateLoadingPlaylists(false));
          dispatch(updatePlaylists(r));
        })
        .catch((e) => {
          dispatch(updateLoadingPlaylists(false));
          console.log(e);
        });
    } else {
      dispatch(updatePlaylists([]));
    }
  }, [userToken]);

  return (null);
}
