import { faPlus } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState } from 'react';
import { getAuthAccounts } from '../../auth';
import { LinkedAccountCard } from '../../components/account/LinkedAccountCard';
import { AuthActions } from '../../components/auth/AuthActions';
import { LinkAuthAccountPanel } from '../../components/auth/LinkAuthAccountPanel';
import { LogoutButton } from '../../components/auth/LogoutButton';
import { IconCard } from '../../components/cards/IconCard';
import { GeneralContent } from '../../components/layout/GeneralContent';
import { Modal } from '../../components/popup/Modal';
import { TopHeading } from '../../components/structure/TopHeading';
import { useAppAuthToken, useAppDispatch, useAppSelector } from '../../store/helper';
import { updateAuthAccounts } from '../../store/reducers/auth';

/**
 * User account page, used for (un)linking accounts and user settings
 */
export function AccountPage() {
  const dispatch = useAppDispatch();
  const userToken = useAppAuthToken();
  const authAccounts = useAppSelector((state) => state.auth.accounts);
  const [showLinkPopup, setShowLinkPopup] = useState(false);

  /**
   * Listen for login changes and update the list of accounts
   */
  useEffect(() => {
    if (!userToken) { return; }
    getAuthAccounts(userToken)
      .then((accounts) => {
        dispatch(updateAuthAccounts(accounts));
      })
      .catch((e) => {
        console.log(e);
      });
  }, [userToken]);

  // User isn't logged in, display 401 error
  if (!userToken) {
    return (
      <GeneralContent center>
        <h1>401</h1>
        <p>You must be logged in.</p>
        <AuthActions />
      </GeneralContent>
    );
  }

  const allowUnlink = authAccounts.length > 1;
  const authAccountCards = authAccounts.map((authAccount) => (
    <LinkedAccountCard
      authAccount={authAccount}
      allowUnlink={allowUnlink}
      key={authAccount.id}
    />
  ));

  return (
    <GeneralContent padTop padBottom>
      {/* User Actions area */}
      <TopHeading subheading="Your Account">
        Actions
      </TopHeading>
      <LogoutButton />
      {/* User's linked accounts area */}
      <TopHeading subheading="Your Account">
        Linked Accounts
      </TopHeading>
      {authAccountCards}
      <IconCard
        icon={faPlus}
        onClick={() => setShowLinkPopup(true)}
      >
        Link Another Account
      </IconCard>
      <Modal
        onClose={() => setShowLinkPopup(false)}
        visible={showLinkPopup}
      >
        <LinkAuthAccountPanel onClose={() => setShowLinkPopup(false)} />
      </Modal>
    </GeneralContent>
  );
}
