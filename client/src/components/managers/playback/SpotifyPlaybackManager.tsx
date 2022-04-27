import { useEffect, useState } from 'react';
import { playTrack } from '../../../apis/playback';
import { getAccessToken } from '../../../auth';
import { useAppAuthToken, useAppDispatch, useAppSelector } from '../../../store/helper';
import { incrementPlaybackTimestamp, updatePlaybackTimestamp } from '../../../store/reducers/playback';
import { PlaybackState } from '../../../types';
import { AuthProvider, MediaProvider } from '../../../types/public';

/**
 * Handles playing YouTube videos
 * THERE SHOULD ONLY EVER BE 1 OF THESE
 */
export function SpotifyPlaybackManager() {
  const dispatch = useAppDispatch();
  const currentTrack = useAppSelector((state) => state.playback.currentTrack);
  const playbackState = useAppSelector((state) => state.playback.playbackState);
  const [loaded, setLoaded] = useState(false);
  const [player, setPlayer] = useState<Spotify.Player>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [deviceId, setDeviceId] = useState<string>();
  const userToken = useAppAuthToken();

  const destroyPlayer = (oldPlayer: Spotify.Player) => {
    oldPlayer.removeListener('ready');
    oldPlayer.removeListener('not_ready');
    oldPlayer.removeListener('player_state_changed');
    oldPlayer.disconnect();
  };

  useEffect(() => {
    // Add handle for when the spotify api loads
    window.onSpotifyWebPlaybackSDKReady = () => {
      if (loaded) {
        console.log('Already loaded');
      }
      setLoaded(true);
      if (player) {
        destroyPlayer(player);
      }
      const newPlayer = new Spotify.Player({
        name: 'FYP Music Web Player',
        getOAuthToken: (cb) => {
          if (!userToken) { cb(''); return; }
          getAccessToken(AuthProvider.Spotify, userToken).then((token) => {
            cb(token);
          });
        },
      });
      setPlayer(newPlayer);
      // Set up event listeners for the player
      newPlayer.addListener('ready', ({ device_id }) => {
        console.log(`Ready with device ID ${device_id}`);
        setDeviceId(device_id);
      });

      newPlayer.addListener('not_ready', ({ device_id }) => {
        console.log(`Not ready with device id ${device_id}`);
      });

      newPlayer.addListener('initialization_error', ({ message }) => {
        console.error(message);
      });

      newPlayer.addListener('authentication_error', ({ message }) => {
        console.error(message);
      });

      newPlayer.addListener('account_error', ({ message }) => {
        console.error(message);
      });

      newPlayer.addListener('player_state_changed', (state) => {
        console.log(state);
        if (!state.paused) {
          dispatch(updatePlaybackTimestamp(state.position));
        }
      });

      newPlayer.connect();
    };

    // Load the Spotify SDK
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (player) {
        destroyPlayer(player);
      }
      document.body.removeChild(script);
    };
  }, [userToken]);

  /**
   * Stop/Start a track when current track changes
   */
  useEffect(() => {
    if (!player) { return; }
    if (!currentTrack || currentTrack.provider !== MediaProvider.Spotify) {
      if (isPlaying) {
        setIsPlaying(false);
        player.pause();
      }
    } else {
      setIsPlaying(true);
      if (!userToken) { return; }
      playTrack(currentTrack, userToken, deviceId)
        .then(() => {
          player.resume();
        });
    }
  }, [currentTrack]);

  /**
   * Update the player if the playback state is changed by the user
   */
  useEffect(() => {
    if (!player) { return; }
    if (!currentTrack || currentTrack.provider !== MediaProvider.Spotify) {
      if (isPlaying) {
        setIsPlaying(false);
        player.pause();
      }
    } else if (playbackState === PlaybackState.Playing) {
      setIsPlaying(true);
      player.resume();
    } else {
      setIsPlaying(false);
      player.pause();
    }
  }, [playbackState]);

  /**
   * Update the current playback duration
   */
  useEffect(() => {
    const timer = window.setInterval(() => {
      if (player && currentTrack && currentTrack.provider === MediaProvider.Spotify) {
        if (playbackState === PlaybackState.Playing) {
          dispatch(incrementPlaybackTimestamp(1000));
        }
      }
    }, 1000);
    return () => { window.clearInterval(timer); };
  }, [player, currentTrack, playbackState]);

  return (null);
}
