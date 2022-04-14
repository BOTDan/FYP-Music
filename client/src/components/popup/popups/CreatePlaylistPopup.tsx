import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { createPlaylist } from '../../../apis/playlists';
// import { createPlaylist } from '../../../apis/playlists';
import { useAppAuthToken } from '../../../store/helper';
import { Button } from '../../input/Button';
import { StringInput } from '../../input/StringInput';
import { Modal } from '../Modal';
import { Panel } from '../Panel';

export interface CreatePlaylistPopupProps {
  visible: boolean;
  onClose?: () => void;
}

export function CreatePlaylistPopup({ visible, onClose }: CreatePlaylistPopupProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [submit, setSubmit] = useState(false);
  const userToken = useAppAuthToken();
  const navigate = useNavigate();

  useEffect(() => {
    setName('');
    setDescription('');
  }, [visible]);

  useEffect(() => {
    if (submit) {
      createPlaylist({
        name, description,
      }, userToken)
        .then((playlist) => {
          navigate(`/playlists/${playlist.id}`);
        });
      setSubmit(false);
    }
  }, [submit]);

  return (
    <Modal visible={visible} onClose={onClose}>
      <Panel
        isForm
        header="Create Playlist"
        closeButton="Cancel"
        onClose={onClose}
        footer={(
          <Button
            onClick={() => setSubmit(true)}
          >
            Create
          </Button>
        )}
      >
        <StringInput
          value={name}
          onChange={setName}
          label="Name:"
          placeholder="Name"
          vertical
          autoComplete="off"
        />
        <StringInput
          value={description}
          onChange={setDescription}
          label="Description:"
          placeholder="Description"
          vertical
          autoComplete="off"
        />
      </Panel>
    </Modal>
  );
}

CreatePlaylistPopup.defaultProps = {
  onClose: () => {},
};
