/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InternalPlaylist } from '../../types';

interface PlaylistsState {
  value: InternalPlaylist[];
  loading: boolean;
}

const initialState: PlaylistsState = {
  value: [],
  loading: false,
};

export const playlistsSlice = createSlice({
  name: 'Playlists',
  initialState,
  reducers: {
    updatePlaylists: (state, action: PayloadAction<InternalPlaylist[]>) => {
      state.value = action.payload;
    },
    updateLoadingPlaylists: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { updatePlaylists, updateLoadingPlaylists } = playlistsSlice.actions;

export default playlistsSlice.reducer;
