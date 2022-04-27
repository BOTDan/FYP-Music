import {
  faPause, faPlay, faVolumeHigh, faVolumeLow, faVolumeMute,
} from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/helper';
import { updatePlaybackState, updateVolume } from '../../store/reducers/playback';
import { PlaybackState } from '../../types';
import { Button } from '../input/Button';
import { Slider } from '../input/Slider';
import './PlaybackControls.scss';

/**
 * Contains buttons to play, pause and skip currently playing music
 */
export function PlaybackControls() {
  const dispatch = useAppDispatch();
  const playbackState = useAppSelector((state) => state.playback.playbackState);
  const volume = useAppSelector((state) => state.playback.volume);
  const [volumeVisible, setVolumeVisible] = useState(false);

  const play = () => {
    dispatch(updatePlaybackState(PlaybackState.Playing));
  };

  const pause = () => {
    dispatch(updatePlaybackState(PlaybackState.Paused));
  };

  const changeVolume = (value: number) => {
    dispatch(updateVolume(value));
  };

  const toggleVolumeSlider = () => {
    setVolumeVisible(!volumeVisible);
  };

  let volumeIcon = faVolumeMute;
  if (volume > 0) {
    if (volume < 50) {
      volumeIcon = faVolumeLow;
    } else {
      volumeIcon = faVolumeHigh;
    }
  }

  return (
    <div className="PlaybackControls">
      {(playbackState === PlaybackState.Playing)
        ? <Button leftIcon={faPause} onClick={pause} bland />
        : <Button leftIcon={faPlay} onClick={play} bland />}
      <Button leftIcon={volumeIcon} onClick={toggleVolumeSlider} bland />
      <div className={`PlaybackControls__Volume ${volumeVisible ? 'visible' : ''}`}>
        <Slider min={0} max={100} value={volume} onChange={changeVolume} />
      </div>
    </div>
  );
}
