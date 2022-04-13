import { faBan, faList } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';
import { removeSongFromPlaylist } from '../../../apis/playlists';
import { useAppSelector } from '../../../store/helper';
import { ExternalTrack, InternalPlaylist, TrackOnInternalPlaylist } from '../../../types';
// eslint-disable-next-line import/no-cycle
import { TrackCard } from '../../cards/TrackCard';
import { Button } from '../../input/Button';
import { Modal } from '../Modal';
import { Panel } from '../Panel';
// eslint-disable-next-line import/no-cycle
import { AddTrackToPlaylistPopup } from './AddTrackToPlaylistPopup';

export interface TrackOptionsPopupProps {
  visible: boolean;
  track: ExternalTrack | TrackOnInternalPlaylist;
  playlist?: InternalPlaylist;
  onClose?(): void
}

export function TrackOptionsPopup({
  visible, onClose, track, playlist,
}: TrackOptionsPopupProps) {
  const [showAddTrack, setShowAddTrack] = useState(false);
  const userToken = useAppSelector((state) => state.auth.token);

  const finalTrack = (track as TrackOnInternalPlaylist).track ?? (track as ExternalTrack);

  const removeTrack = () => {
    removeSongFromPlaylist(playlist!, track as TrackOnInternalPlaylist, userToken)
      .then((r) => {
        console.log(r);
        if (onClose) { onClose(); }
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
