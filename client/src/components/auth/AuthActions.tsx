import React, { useState } from 'react';
import { useAppAuthToken } from '../../store/helper';
import { Button } from '../input/Button';
import { Modal } from '../popup/Modal';
import './AuthActions.scss';
import { LoginPanel } from './LoginPanel';

export function AuthActions() {
  const authToken = useAppAuthToken();
  const [popupVisible, setPopupVisible] = useState(false);

  let content = (
    <>
      <Button onClick={() => setPopupVisible(true)}>
        Log In
      </Button>
      <Modal visible={popupVisible} onClose={() => setPopupVisible(false)}>
        <LoginPanel onClose={() => setPopupVisible(false)} />
      </Modal>
    </>
  );

  if (authToken) {
    content = (
      <Button>
        Logged In
      </Button>
    );
  }

  return (
    <div className="AuthActions">
      {content}
    </div>
  );
}
