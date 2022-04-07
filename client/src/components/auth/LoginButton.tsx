import React, { useState } from 'react';
import { login } from '../../auth';
import { authProviderPrettyPrint } from '../../helper';
import { useAppDispatch } from '../../store/helper';
import { updateToken } from '../../store/reducers/auth';
// import { mediaProviderPrettyPrint } from '../../helper';
import { AuthProvider } from '../../types';
import { LoadingSpinner } from '../icons/LoadingSpinner';
import { ProviderIcon } from '../icons/ProviderIcon';
import { Button } from '../input/Button';
import './LoginButton.scss';
import { LoginPopup } from './LoginPopup';

export interface LoginButtonProps {
  provider: AuthProvider;
}

/**
 * Creates a button for logging in using the given provider
 * @param props The props for this button
 * @returns A login button
 */
export function LoginButton({ provider }: LoginButtonProps) {
  const dispatch = useAppDispatch();
  const [popupVisible, setPopupVisible] = useState(false);

  function onPopupClose() {
    setPopupVisible(false);
  }

  function onCode(code: string, state: string) {
    console.log(`Returned ${code} and state ${state}`);
    login(provider, code)
      .then((data) => {
        dispatch(updateToken(data.token));
      });
  }
  return (
    <Button
      className="LoginButton block text-left"
      onClick={() => setPopupVisible(true)}
    >
      {popupVisible
        ? <LoadingSpinner inline />
        : (<ProviderIcon provider={provider} />)}
      {' '}
      Log In Using {authProviderPrettyPrint(provider)}
      <LoginPopup
        provider={provider}
        visible={popupVisible}
        onClose={onPopupClose}
        onCode={onCode}
      />
    </Button>
  );
}
