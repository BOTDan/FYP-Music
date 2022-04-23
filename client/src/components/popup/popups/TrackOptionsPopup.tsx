import { faBan, faList } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';
import { removeTrackFromPlaylistToStore } from '../../../store/actions/playlists';
import { useAppAuthToken, useAppDispatch } from '../../../store/helper';
import { ExternalTrack, PlaylistDTO, TrackOnPlaylistDTO } from '../../../types/public';
// eslint-disable-next-line import/no-cycle
import { TrackCard } from '../../cards/TrackCard';
import { Button } from '../../input/Button';
import { Modal } from '../Modal';
import { Panel } from '../Panel';
// eslint-disable-next-line import/no-cycle
import { AddTrackToPlaylistPopup } from './AddTrackToPlaylistPopup';

export interface TrackOptionsPopupProps {
  visible: boolean;
  track: ExternalTrack | TrackOnPlaylistDTO;
  playlist?: PlaylistDTO;
  onClose?(): void
}

export function TrackOptionsPopup({
  visible, onClose, track, playlist,
}: TrackOptionsPopupProps) {
  const [showAddTrack, setShowAddTrack] = useState(false);
  const userToken = useAppAuthToken();
  const dispatch = useAppDispatch();

  const finalTrack = (track as TrackOnPlaylistDTO).track ?? (track as ExternalTrack);

  const removeTrack = () => {
    removeTrackFromPlaylistToStore(playlist!, track as TrackOnPlaylistDTO, userToken, dispatch)
      .then((r) => {
        console.log(r);
        // if (onClose) { onClose(); }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const addTrackPopup = (showAddTrack)
    ? (
      <AddTrackToPlaylistPopup
        track={finalTrack}
        visible={showAddTrack}
        onClose={() => setShowAddTrack(false)}
      />
    )
    : (null);

  return (
    <>
      <Modal visible={visible} onClose={onClose}>
        <Panel
          header="Track Options"
          closeButton="Close"
          onClose={onClose}
          isForm
        >
          <TrackCard track={track} small inactive />
          <Button
            className="text-left"
            leftIcon={faList}
            onClick={() => setShowAddTrack(true)}
          >
            {' '}Add to Playlist
          </Button>
          {playlist
          && (
          <Button
            className="text-left"
            leftIcon={faBan}
            onClick={removeTrack}
          >
            {' '}Remove from Playlist
          </Button>
          )}
        </Panel>
      </Modal>
      {addTrackPopup}
    </>
  );
}

TrackOptionsPopup.defaultProps = {
  onClose: undefined,
  playlist: undefined,
};
