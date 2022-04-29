/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PlaybackState } from '../../types';
import { ExternalTrack } from '../../types/public';

const initialState = {
  currentTrack: null as ExternalTrack | null,
  playbackState: PlaybackState.Stopped,
  playbackTimestamp: 0,
  volume: 50,
};

export const playbackSlice = createSlice({
  name: 'Playback',
  initialState,
  reducers: {
    updateCurrentTrack: (state, action: PayloadAction<ExternalTrack | null>) => {
      state.currentTrack = action.payload;
      state.playbackTimestamp = 0;
      if (action.payload === null) {
        state.playbackState = PlaybackState.Stopped;
      } else {
        state.playbackState = PlaybackState.Playing;
      }
    },
    updatePlaybackState: (state, action: PayloadAction<PlaybackState>) => {
      state.playbackState = action.payload;
      if (action.payload === PlaybackState.Stopped) {
        state.playbackTimestamp = 0;
      } else if (action.payload === PlaybackState.Finished) {
        if (state.currentTrack) {
          state.playbackTimestamp = state.currentTrack.duration;
        }
      }
    },
    updatePlaybackTimestamp: (state, action: PayloadAction<number>) => {
      if (state.currentTrack) {
        state.playbackTimestamp = Math.min(
          action.payload,
          state.currentTrack.duration,
        );
      } else {
        state.playbackTimestamp = action.payload;
      }
    },
    incrementPlaybackTimestamp: (state, action: PayloadAction<number>) => {
      if (state.currentTrack) {
        state.playbackTimestamp = Math.min(
          state.playbackTimestamp + action.payload,
          state.currentTrack.duration,
        );
      } else {
        state.playbackTimestamp += action.payload;
      }
    },
    updateVolume: (state, action: PayloadAction<number>) => {
      state.volume = action.payload;
    },
  },
});

export const {
  updateCurrentTrack, updatePlaybackState, updatePlaybackTimestamp, incrementPlaybackTimestamp,
  updateVolume,
} = playbackSlice.actions;

export default playbackSlice.reducer;
