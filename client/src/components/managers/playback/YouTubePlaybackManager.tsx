import React, { useEffect, useState } from 'react';
import YouTube, { YouTubeProps } from 'react-youtube';
import { useAppSelector } from '../../../store/helper';
import { PlaybackState } from '../../../types';
import { MediaProvider } from '../../../types/public';

/**
 * Handles playing YouTube videos
 * THERE SHOULD ONLY EVER BE 1 OF THESE
 */
export function YouTubePlaybackManager() {
  const currentTrack = useAppSelector((state) => state.playback.currentTrack);
  const playbackState = useAppSelector((state) => state.playback.playbackState);
  const [player, setPlayer] = useState<YouTube['internalPlayer']>(null);
  const [videoId, setVideoId] = useState('');

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
  };

  /**
   * Handles callbacks for when a video finishes playing
   * @param event The event from the YouTube embed
   */
  const handleOnEnd: YouTubeProps['onEnd'] = () => {
    console.log('Video finished');
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
      player.playVideo();
    } else {
      player.pauseVideo();
    }
  }, [playbackState]);

  const opts = {
    playerVars: {
      autoplay: 1,
      mute: 1, // Autoplay doesn't work without this...(???)
      // Guessing this is YouTube/Chrome trying to save people from annoying unexpected videos
    },
  };

  return (
    <YouTube
      videoId={videoId}
      opts={opts}
      onReady={handleOnReady}
      onPlay={handleOnPlay}
      onEnd={handleOnEnd}
    />
  );
}
