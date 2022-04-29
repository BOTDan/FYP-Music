import React, { useState } from 'react';
import { useAppAuthToken } from '../../store/helper';
import { Button } from '../input/Button';
import { Modal } from '../popup/Modal';
import './AuthActions.scss';
import { LoginPanel } from './LoginPanel';

/**
 * Collection of buttons for the top-right of the app
 */
export function AuthActions() {
  const authToken = useAppAuthToken();
  const [popupVisible, setPopupVisible] = useState(false);

  let content = (
    <>
      <Button onClick={() => setPopupVisible(true)}>
        Log In
      </Button>
      {popupVisible && (
      <Modal visible={popupVisible} onClose={() => setPopupVisible(false)}>
        <LoginPanel onClose={() => setPopupVisible(false)} />
      </Modal>
      )}
    </>
  );

  if (authToken) {
    content = (
      <Button to="/account">
        My Account
      </Button>
    );
  }

  return (
    <div className="AuthActions">
      {content}
    </div>
  );
}
