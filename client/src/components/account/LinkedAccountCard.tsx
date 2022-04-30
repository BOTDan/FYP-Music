import { faTrash } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';
import { unlinkAccount } from '../../auth';
import { providerPrettyPrint } from '../../helper';
import { useAppAuthToken, useAppDispatch } from '../../store/helper';
import { removeAuthAccount } from '../../store/reducers/auth';
import { addErrorToaster } from '../../store/reducers/notifications';
import { AuthAccountDTO } from '../../types/public';
import { IconCard } from '../cards/IconCard';
import { classes, ProviderIcon } from '../icons/ProviderIcon';
import { Button } from '../input/Button';
import { ConfirmPopup } from '../popup/popups/ConfirmPopup';
import './LinkedAccountCard.scss';

export interface LinkedAccountCardProps {
  authAccount: AuthAccountDTO;
  allowUnlink?: boolean;
}

/**
 * A card to show a linked account for a user, with remove options
 * @param props The props object
 */
export function LinkedAccountCard({ authAccount, allowUnlink }: LinkedAccountCardProps) {
  const userToken = useAppAuthToken();
  const dispatch = useAppDispatch();
  const [showPopup, setShowPopup] = useState(false);

  const unlink = async () => {
    try {
      if (!userToken) { throw new Error('Tried to unlink account with no login'); }
      await unlinkAccount(authAccount, userToken);
      dispatch(removeAuthAccount(authAccount));
    } catch (e) {
      dispatch(addErrorToaster(e));
    }
  };

  const classList = ['LinkedAccountCard'];
  classList.push(classes[authAccount.provider]);

  return (
    <IconCard
      className={classList.join(' ')}
      iconContent={(<ProviderIcon provider={authAccount.provider} />)}
    >
      <p>{providerPrettyPrint(authAccount.provider)}</p>
      <Button
        className="LinkedAccountCard__Delete"
        leftIcon={faTrash}
        disabled={!allowUnlink}
        onClick={() => setShowPopup(true)}
      >
        {' '}Unlink
      </Button>
      <ConfirmPopup
        visible={showPopup}
        onClose={() => setShowPopup(false)}
        onConfirm={unlink}
        confirmButton="Unlink"
        confirmButtonIcon={faTrash}
        header="Unlink Account"
      >
        Are you sure you want to unlink this account?
      </ConfirmPopup>
    </IconCard>
  );
}

LinkedAccountCard.defaultProps = {
  allowUnlink: false,
};
