import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { createPlaylistToStore } from '../../../store/actions/playlists';
// import { createPlaylist } from '../../../apis/playlists';
import { useAppAuthToken, useAppDispatch } from '../../../store/helper';
import { addErrorToaster } from '../../../store/reducers/notifications';
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
  const dispatch = useAppDispatch();

  useEffect(() => {
    setName('');
    setDescription('');
  }, [visible]);

  useEffect(() => {
    if (submit) {
      createPlaylistToStore({
        name, description,
      }, userToken, dispatch)
        .then((playlist) => {
          navigate(`/playlists/${playlist.id}`);
        })
        .catch((e) => {
          dispatch(addErrorToaster(e));
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
