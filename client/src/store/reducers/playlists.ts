/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ExternalTrack, PlaylistDTO } from '../../types/public';

interface PlaylistsState {
  value: PlaylistDTO[];
  loading: boolean;
  trackToAdd: ExternalTrack | undefined;
}

const initialState: PlaylistsState = {
  value: [],
  loading: false,
  trackToAdd: undefined,
};

export const playlistsSlice = createSlice({
  name: 'Playlists',
  initialState,
  reducers: {
    updatePlaylists: (state, action: PayloadAction<PlaylistDTO[]>) => {
      state.value = action.payload;
    },
    updateLoadingPlaylists: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    updateTrackToAdd: (state, action: PayloadAction<ExternalTrack | undefined>) => {
      state.trackToAdd = action.payload;
    },
  },
});

export const { updatePlaylists, updateLoadingPlaylists, updateTrackToAdd } = playlistsSlice.actions;

export default playlistsSlice.reducer;
