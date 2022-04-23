import React from 'react';
import { useAppSelector } from '../../store/helper';
import { ProviderIcon } from '../icons/ProviderIcon';
import { SquareImage } from '../structure/SquareImage';
import { PlaybackControls } from './PlaybackControls';
import './PlaybackBar.scss';
import { GeneralContent } from '../layout/GeneralContent';

/**
 * The main playback bar at the bottom of the page
 */
export function PlaybackBar() {
  const currentTrack = useAppSelector((state) => state.playback.currentTrack);
  const currentTime = useAppSelector((state) => state.playback.playbackTimestamp);

  const width = (currentTrack)
    ? (currentTime / currentTrack.duration) * 100
    : 0;

  return (
    <GeneralContent className="PlaybackBar__Container">
      <div className="PlaybackBar">
        {currentTrack
        && (
        <div className="PlaybackBar__Info">
          <span className="PlaybackBar__Info__Provider">
            <ProviderIcon provider={currentTrack.provider} />
          </span>
          <span className="PlaybackBar__Info__Image">
            <SquareImage src={currentTrack.image} alt="" />
          </span>
          <span className="PlaybackBar__Info__Main">
            <p className="PlaybackBar__Info__Name">{currentTrack.name}</p>
            <p className="PlaybackBar__Info__Artists">{currentTrack.artists.map((artist) => artist.name).join(', ')}</p>
          </span>
        </div>
        )}
        <PlaybackControls />
      </div>
      <div className="PlaybackBar__Scrub" style={{ width: `${width}%` }} />
    </GeneralContent>
  );
}
