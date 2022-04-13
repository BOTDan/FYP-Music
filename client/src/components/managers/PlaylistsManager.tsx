import React, { useEffect, useState } from 'react';
import { getMyPlaylists } from '../../apis/playlists';
import { useAppDispatch, useAppSelector } from '../../store/helper';
import { updateLoadingPlaylists, updatePlaylists, updateTrackToAdd } from '../../store/reducers/playlists';
import { ExternalTrack } from '../../types';
import { AddTrackToPlaylistPopup } from '../popup/popups/AddTrackToPlaylistPopup';

/**
 * A playlist store manager, handles getting users playlists
 * THERE SHOULD ONLY EVER BE 1 OF THESE
 * @returns A playlist store manager
 */
export function PlaylistsManager() {
  const dispatch = useAppDispatch();
  const userToken = useAppSelector((state) => state.auth.token);
  const trackToAdd = useAppSelector((state) => state.playlists.trackToAdd);

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

  const [popupVisible, setPopupVisible] = useState(false);
  const [popupTrack, setPopupTrack] = useState<ExternalTrack>();
  // Runs when something wants to display the add track to playlist popup
  useEffect(() => {
    if (trackToAdd) {
      setPopupTrack(trackToAdd);
      setPopupVisible(true);
      dispatch(updateTrackToAdd(undefined));
    }
  }, [trackToAdd]);

  if (popupTrack) {
    return (
      <AddTrackToPlaylistPopup
        visible={popupVisible}
        track={popupTrack}
        onClose={() => setPopupVisible(false)}
      />
    );
  }
  return (null);
}
