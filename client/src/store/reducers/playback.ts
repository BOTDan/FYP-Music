/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PlaybackState } from '../../types';
import { ExternalTrack } from '../../types/public';

const initialState = {
  currentTrack: null as ExternalTrack | null,
  playbackState: PlaybackState.Stopped,
  playbackTimestamp: 0,
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
      }
    },
    updatePlaybackTimestamp: (state, action: PayloadAction<number>) => {
      state.playbackTimestamp = action.payload;
    },
    incrementPlaybackTimestamp: (state, action: PayloadAction<number>) => {
      state.playbackTimestamp += action.payload;
    },
  },
});

export const {
  updateCurrentTrack, updatePlaybackState, updatePlaybackTimestamp, incrementPlaybackTimestamp,
} = playbackSlice.actions;

export default playbackSlice.reducer;
