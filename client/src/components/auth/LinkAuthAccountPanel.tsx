import React from 'react';
import { useAppSelector } from '../../store/helper';
import { AuthProvider } from '../../types/public';
import { Panel } from '../popup/Panel';
import { AuthAccountLoginButton } from './AuthAccountLoginButton';
import './LoginPanel.scss';

interface LinkAuthAccountPanelProps {
  onClose?: () => void;
}

/**
 * Creates a panel with login buttons for all auth providers
 * @returns A login panel
 */
export function LinkAuthAccountPanel({ onClose }: LinkAuthAccountPanelProps) {
  const authAccounts = useAppSelector((state) => state.auth.accounts);
  return (
    <Panel
      className="LoginPanel"
      header="Link Account"
      closeButton="Cancel"
      onClose={onClose}
    >
      <AuthAccountLoginButton
        provider={AuthProvider.Google}
        onSuccess={onClose}
        link
        disabled={authAccounts.filter((a) => a.provider === AuthProvider.Google).length > 0}
      />
      <AuthAccountLoginButton
        provider={AuthProvider.Spotify}
        onSuccess={onClose}
        link
        disabled={authAccounts.filter((a) => a.provider === AuthProvider.Spotify).length > 0}
      />
    </Panel>
  );
}

LinkAuthAccountPanel.defaultProps = {
  onClose: undefined,
};
