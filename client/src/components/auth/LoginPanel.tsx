import React from 'react';
import { AuthProvider } from '../../types/public';
import { Panel } from '../popup/Panel';
import { LoginButton } from './LoginButton';
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
      <LoginButton provider={AuthProvider.Google} />
      <LoginButton provider={AuthProvider.Spotify} />
    </Panel>
  );
}

LoginPanel.defaultProps = {
  onClose: undefined,
};
