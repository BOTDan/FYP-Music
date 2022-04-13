import { faBan, faList } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';
import { ExternalTrack } from '../../../types';
// eslint-disable-next-line import/no-cycle
import { TrackCard } from '../../cards/TrackCard';
import { Button } from '../../input/Button';
import { Modal } from '../Modal';
import { Panel } from '../Panel';
// eslint-disable-next-line import/no-cycle
import { AddTrackToPlaylistPopup } from './AddTrackToPlaylistPopup';

export interface TrackOptionsPopupProps {
  visible: boolean;
  track: ExternalTrack;
  onClose?(): void
}

export function TrackOptionsPopup({ visible, onClose, track }: TrackOptionsPopupProps) {
  const [showAddTrack, setShowAddTrack] = useState(false);

  const addTrackPopup = (showAddTrack)
    ? (
      <AddTrackToPlaylistPopup
        track={track}
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
          <Button
            className="text-left"
            leftIcon={faBan}
            onClick={() => setShowAddTrack(true)}
          >
            {' '}Remove from Playlist
          </Button>
        </Panel>
      </Modal>
      {addTrackPopup}
    </>
  );
}

TrackOptionsPopup.defaultProps = {
  onClose: undefined,
};
