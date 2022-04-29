import React from 'react';
import { AuthProvider } from '../../types/public';
import { Panel } from '../popup/Panel';
import { AuthAccountLoginButton } from './AuthAccountLoginButton';
import './LoginPanel.scss';

interface LoginPanelProps {
  onClose?: () => void;
}

/**
 * Creates a panel with login buttons for all auth providers
 * @returns A login panel
 */
export function LoginPanel({ onClose }: LoginPanelProps) {
  return (
    <Panel
      className="LoginPanel"
      header="Log In"
      closeButton="Cancel"
      onClose={onClose}
    >
      <AuthAccountLoginButton provider={AuthProvider.Google} />
      <AuthAccountLoginButton provider={AuthProvider.Spotify} />
    </Panel>
  );
}

LoginPanel.defaultProps = {
  onClose: undefined,
};
