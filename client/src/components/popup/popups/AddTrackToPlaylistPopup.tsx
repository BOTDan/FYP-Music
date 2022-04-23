import React, { useEffect, useState } from 'react';
import { addTrackToPlaylistToStore } from '../../../store/actions/playlists';
import { useAppAuthToken, useAppDispatch, useAppPersonalPlaylists } from '../../../store/helper';
import { ExternalTrack, PlaylistDTO } from '../../../types/public';
// eslint-disable-next-line import/no-cycle
import { TrackCard } from '../../cards/TrackCard';
import { LoadingSpinner } from '../../icons/LoadingSpinner';
import { PlaylistMultiSelect } from '../../input/advanced/PlaylistMultiSelect';
import { Button } from '../../input/Button';
import { Modal } from '../Modal';
import { Panel } from '../Panel';

export interface AddTrackToPlaylistPopupProps {
  visible: boolean;
  track: ExternalTrack;
  onClose?(): void;
}

export function AddTrackToPlaylistPopup({ visible, track, onClose }: AddTrackToPlaylistPopupProps) {
  const [checked, setChecked] = useState<PlaylistDTO[]>([]);
  const [submit, setSubmit] = useState(false);
  const userPlaylists = useAppPersonalPlaylists().value ?? [];
  const userToken = useAppAuthToken();
  const dispatch = useAppDispatch();

  function handleOnCheck(playlist: PlaylistDTO) {
    setChecked((prev) => [...prev, playlist]);
  }

  function handleOnUncheck(playlist: PlaylistDTO) {
    setChecked((prev) => [...prev].filter((o) => o.id !== playlist.id));
  }

  useEffect(() => {
    if (submit) {
      const promises = checked.map(
        (playlist) => addTrackToPlaylistToStore(playlist, track, userToken, dispatch),
      );
      Promise.all(promises)
        .then(() => {
          console.log('Success');
          setSubmit(false);
          if (onClose) {
            onClose();
          }
        })
        .catch((e) => {
          console.log(e);
          setSubmit(false);
        });
    }
  }, [submit]);

  useEffect(() => {
    if (visible) {
      setChecked([]);
      setSubmit(false);
    }
  }, [visible]);

  return (
    <Modal visible={visible} onClose={onClose}>
      <Panel
        isForm
        header="Add Track to Playlist"
        closeButton="Cancel"
        onClose={onClose}
        footer={(
          <Button
            onClick={() => setSubmit(true)}
            disabled={checked.length === 0 || submit}
          >
            {submit ? <LoadingSpinner /> : 'Add' }
          </Button>
        )}
      >
        <TrackCard track={track} small inactive />
        <p>Select the playlist to add this track to.</p>
        <PlaylistMultiSelect
          playlists={userPlaylists}
          checked={checked}
          onCheck={handleOnCheck}
          onUncheck={handleOnUncheck}
        />
      </Panel>
    </Modal>
  );
}

AddTrackToPlaylistPopup.defaultProps = {
  onClose: undefined,
};
