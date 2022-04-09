import { faHome, faList } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import './BottomBar.scss';
import { BottomBarLink } from './BottomBarLink';

/**
 * The main bottom navigation bar for the app
 */
export function BottomBar() {
  return (
    <div className="BottomBar">
      <BottomBarLink name="Home" icon={faHome} to="/" />
      <BottomBarLink name="Playlists" icon={faList} to="/playlists" />
    </div>
  );
}
