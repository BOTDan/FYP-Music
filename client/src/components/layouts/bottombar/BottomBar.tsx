import { faHome, faList } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { GeneralContent } from '../../layout/GeneralContent';
import { PlaybackBar } from '../../playback/PlaybackBar';
import './BottomBar.scss';
import { BottomBarLink } from './BottomBarLink';

/**
 * The main bottom navigation bar for the app
 */
export function BottomBar() {
  return (
    <div className="BottomBar">
      <GeneralContent>
        <PlaybackBar />
        <div className="BottomBar__Links">
          <BottomBarLink name="Home" icon={faHome} to="/" />
          <BottomBarLink name="Playlists" icon={faList} to="/playlists" />
        </div>
      </GeneralContent>
    </div>
  );
}
