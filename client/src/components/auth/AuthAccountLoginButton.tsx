import React, { useState } from 'react';
import { generateLinkToken, linkAccount, login } from '../../auth';
import { authProviderPrettyPrint } from '../../helper';
import { useAppAuthToken, useAppDispatch } from '../../store/helper';
// import { mediaProviderPrettyPrint } from '../../helper';
import { AuthProvider } from '../../types/public';
import { LoadingSpinner } from '../icons/LoadingSpinner';
import { classes, ProviderIcon } from '../icons/ProviderIcon';
import { Button } from '../input/Button';
import './LoginButton.scss';
import { AuthAccountExternalLoginPopup } from './AuthAccountExternalLoginPopup';
import { addAuthAccount } from '../../store/reducers/auth';

export interface LoginButtonProps {
  provider: AuthProvider;
  link?: boolean;
  disabled?: boolean;
  onSuccess?(): void;
}

/**
 * Creates a button for logging in using the given provider
 * @param props The props for this button
 * @returns A login button
 */
export function AuthAccountLoginButton({
  provider, link, disabled, onSuccess,
}: LoginButtonProps) {
  const dispatch = useAppDispatch();
  const userToken = useAppAuthToken();
  const [popupVisible, setPopupVisible] = useState(false);

  function onPopupClose() {
    setPopupVisible(false);
  }

  function onCode(code: string, state: string) {
    console.log(`Returned ${code} and state ${state}`);
    if (link) {
      if (!userToken) {
        throw new Error('Tried to link account while not logged in.');
      }
      generateLinkToken(provider, code)
        .then((linkToken) => {
          linkAccount(linkToken, userToken)
            .then((account) => {
              dispatch(addAuthAccount(account));
              if (onSuccess) { onSuccess(); }
            });
        });
    } else {
      login(provider, code, dispatch)
        .then(() => {
          if (onSuccess) { onSuccess(); }
        });
    }
  }
  return (
    <Button
      className={`LoginButton block text-left ${classes[provider]}`}
      onClick={() => setPopupVisible(true)}
      disabled={disabled}
    >
      <div className="LoginButton__Left">
        {popupVisible
          ? <LoadingSpinner inline />
          : (<ProviderIcon provider={provider} />)}
      </div>
      <div className="LoginButton__Right">
        {link
          ? `Link ${authProviderPrettyPrint(provider)} Account`
          : `Log In using ${authProviderPrettyPrint(provider)}`}
      </div>
      <AuthAccountExternalLoginPopup
        provider={provider}
        visible={popupVisible}
        onClose={onPopupClose}
        onCode={onCode}
        link={link}
      />
    </Button>
  );
}

AuthAccountLoginButton.defaultProps = {
  link: false,
  disabled: false,
  onSuccess: undefined,
};
