import React, { useState } from 'react';
import { useAppSelector } from '../../store/helper';
import { Button } from '../input/Button';
import { Modal } from '../popup/Modal';
import './AuthActions.scss';
import { LoginPanel } from './LoginPanel';

export function AuthActions() {
  const authToken = useAppSelector((state) => state.auth.token);
  const [popupVisible, setPopupVisible] = useState(false);

  if (!authToken) {
    return (
      <div className="AuthActions">
        <Button onClick={() => setPopupVisible(true)}>
          Log In
        </Button>
        <Modal visible={popupVisible} onClose={() => setPopupVisible(false)}>
          <LoginPanel onClose={() => setPopupVisible(false)} />
        </Modal>
      </div>
    );
  }
  return (
    <Button>
      Logged In
    </Button>
  );
}
