import React, { useState } from 'react';
import { logout } from '../../auth';
import { useAppAuthToken, useAppDispatch } from '../../store/helper';
import { updateToken } from '../../store/reducers/auth';
import { StoreObjectState } from '../../types';
import { Button } from '../input/Button';
import { ConfirmPopup } from '../popup/popups/ConfirmPopup';

/**
 * Logout button with confirm dialogue
 */
export function LogoutButton() {
  const dispatch = useAppDispatch();
  const userToken = useAppAuthToken();
  const [showPopup, setShowPopup] = useState(false);

  const handleLogout = async () => {
    if (!userToken) {
      throw new Error('Trying to log out when not logged in');
    }
    await logout(userToken);
    setShowPopup(false);
    dispatch(updateToken({
      state: StoreObjectState.Loaded,
      value: undefined,
    }));
  };

  return (
    <>
      <Button
        onClick={() => setShowPopup(true)}
      >
        Log out
      </Button>
      <ConfirmPopup
        visible={showPopup}
        onClose={() => setShowPopup(false)}
        onConfirm={handleLogout}
        header="Log Out"
      >
        Are you sure you want to log out?
      </ConfirmPopup>
    </>
  );
}
