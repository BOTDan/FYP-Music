import { faPause, faPlay } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { useAppDispatch } from '../../store/helper';
import { updatePlaybackState } from '../../store/reducers/playback';
import { PlaybackState } from '../../types';
import { Button } from '../input/Button';
import './PlaybackControls.scss';

/**
 * Contains buttons to play, pause and skip currently playing music
 */
export function PlaybackControls() {
  const dispatch = useAppDispatch();

  const play = () => {
    dispatch(updatePlaybackState(PlaybackState.Playing));
  };

  const pause = () => {
    dispatch(updatePlaybackState(PlaybackState.Paused));
  };

  return (
    <div className="PlaybackControls">
      <Button leftIcon={faPlay} onClick={play} />
      <Button leftIcon={faPause} onClick={pause} />
    </div>
  );
}
