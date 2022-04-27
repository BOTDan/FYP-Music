import React from 'react';
import { SpotifyPlaybackManager } from './SpotifyPlaybackManager';
import { YouTubePlaybackManager } from './YouTubePlaybackManager';

/**
 * Handles playback, and all other playback handlers
 * THERE SHOULD ONLY EVER BE 1 OF THESE
 */
export function PlaybackManager() {
  return (
    <>
      <YouTubePlaybackManager />
      <SpotifyPlaybackManager />
    </>
  );
}
