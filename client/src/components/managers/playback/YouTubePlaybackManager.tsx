import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import YouTube, { YouTubeProps } from 'react-youtube';
import { useAppDispatch, useAppSelector } from '../../../store/helper';
import { updatePlaybackState, updatePlaybackTimestamp } from '../../../store/reducers/playback';
import { PlaybackState } from '../../../types';
import { MediaProvider } from '../../../types/public';

/**
 * Handles playing YouTube videos
 * THERE SHOULD ONLY EVER BE 1 OF THESE
 */
export function YouTubePlaybackManager() {
  const dispatch = useAppDispatch();
  const currentTrack = useAppSelector((state) => state.playback.currentTrack);
  const playbackState = useAppSelector((state) => state.playback.playbackState);
  const volume = useAppSelector((state) => state.playback.volume);
  const [player, setPlayer] = useState<YouTube['internalPlayer']>(null);
  const [playerState, setPlayerState] = useState<PlaybackState>(PlaybackState.Stopped);
  const [videoId, setVideoId] = useState('');

  const parent = document.getElementById('mediaplayers');
  if (!parent) { throw new Error('Parent doesn\'t exist for playback manager'); }

  /**
   * Handles callbacks for when a video is ready to play
   * @param event The event from the YouTube embed
   */
  const handleOnReady: YouTubeProps['onReady'] = (event) => {
    setPlayer(event.target);

    if (playbackState === PlaybackState.Playing) {
      event.target.playVideo();
    } else {
      event.target.pauseVideo();
    }
  };

  /**
   * Handles callbacks for when a video starts playing
   * @param event The event from the YouTube embed
   */
  const handleOnPlay: YouTubeProps['onPlay'] = (event) => {
    event.target.unMute(); // Unmute to work around autoplay problems.
    setPlayerState(PlaybackState.Playing);
  };

  /**
   * Handles callbacks for when a video is paused
   * @param event The event from the YouTube embed
   */
  const handleOnPause: YouTubeProps['onPause'] = () => {
    setPlayerState(PlaybackState.Paused);
  };

  /**
   * Handles callbacks for when a video finishes playing
   * @param event The event from the YouTube embed
   */
  const handleOnEnd: YouTubeProps['onEnd'] = () => {
    setPlayerState(PlaybackState.Finished);
  };

  /**
   * Stop/Start a track when current track changes
   */
  useEffect(() => {
    if (!player) { return; }
    if (!currentTrack || currentTrack.provider !== MediaProvider.YouTube) {
      player.stopVideo();
      setVideoId('');
    } else {
      setVideoId(currentTrack.providerId);
      player.setVolume(volume);
      player.seekTo(0);
    }
  }, [currentTrack]);

  /**
   * Update the player if the playback state is changed by the user
   */
  useEffect(() => {
    if (!player) { return; }
    if (!currentTrack || currentTrack.provider !== MediaProvider.YouTube) {
      player.stopVideo();
      setVideoId('');
    } else if (playbackState === PlaybackState.Playing) {
      player.setVolume(volume);
      player.playVideo();
    } else {
      player.pauseVideo();
    }
  }, [playbackState]);

  /**
   * Update the current playback duration
   */
  useEffect(() => {
    const timer = window.setInterval(() => {
      if (player && currentTrack && currentTrack.provider === MediaProvider.YouTube) {
        const playbackAmount = player.getCurrentTime();
        dispatch(updatePlaybackTimestamp(playbackAmount * 1000));
      }
    }, 1000);
    return () => { window.clearInterval(timer); };
  }, [player, currentTrack]);

  /**
   * Handle volume changes
   */
  useEffect(() => {
    if (player) {
      player.setVolume(volume);
    }
  }, [volume, player]);

  /**
   * Handle YouTube player state updates
   */
  useEffect(() => {
    if (currentTrack && currentTrack.provider === MediaProvider.YouTube) {
      dispatch(updatePlaybackState(playerState));
    }
  }, [playerState]);

  const opts = {
    host: 'https://www.youtube-nocookie.com',
    width: '100%',
    height: '100%',
    playerVars: {
      origin: window.location.host,
      autoplay: 1,
      mute: 1, // Autoplay doesn't work without this...(???)
      // Guessing this is YouTube/Chrome trying to save people from annoying unexpected videos
    },
  };

  return ReactDOM.createPortal(
    (
      <YouTube
        videoId={videoId}
        opts={opts}
        onReady={handleOnReady}
        onPlay={handleOnPlay}
        onPause={handleOnPause}
        onEnd={handleOnEnd}
        className={videoId === '' ? 'hidden' : ''}
      />
    ), parent,
  );
}
