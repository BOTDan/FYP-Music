/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StoreObject, StoreObjectState } from '../../types';
import { PlaylistDTO, TrackOnPlaylistDTO } from '../../types/public';

const initialState = {
  personal: {
    state: StoreObjectState.Uninitialized,
    value: undefined,
  } as StoreObject<string[]>,
  all: {} as { [key: string]: StoreObject<PlaylistDTO> },
};

export const playlistSlice = createSlice({
  name: 'Playlists',
  initialState,
  reducers: {
    updatePersonalPlaylistsInStore: (state, action: PayloadAction<StoreObject<PlaylistDTO[]>>) => {
      state.personal = {
        state: action.payload.state,
        error: action.payload.error,
        value: action.payload.value?.map((playlist) => playlist.id),
      };
      action.payload.value?.forEach((playlist) => {
        state.all[playlist.id] = {
          state: StoreObjectState.Loaded,
          value: playlist,
        };
      });
    },
    addPersonalPlaylistToStore: (state, action: PayloadAction<PlaylistDTO>) => {
      state.personal.value = [action.payload.id, ...(state.personal.value ?? [])];
      state.all[action.payload.id] = {
        state: StoreObjectState.Loaded,
        value: action.payload,
      };
    },
    updatePlaylistInStore: (
      state,
      action: PayloadAction<{ id: string, value: StoreObject<PlaylistDTO> }>,
    ) => {
      state.all[action.payload.id] = action.payload.value;
    },
    addTrackToPlaylistInStore: (state, action: PayloadAction<TrackOnPlaylistDTO>) => {
      const left = state.all[action.payload.playlist.id].value;
      if (left) {
        left.tracks = [...left.tracks, action.payload];
      }
    },
    removeTrackFromPlaylistInStore: (state, action: PayloadAction<TrackOnPlaylistDTO>) => {
      const left = state.all[action.payload.playlist.id].value;
      if (left) {
        left.tracks = left.tracks.filter(
          (track) => track.id !== action.payload.id,
        );
      }
    },
  },
});

export const {
  updatePersonalPlaylistsInStore, addPersonalPlaylistToStore, updatePlaylistInStore,
  addTrackToPlaylistInStore, removeTrackFromPlaylistInStore,
} = playlistSlice.actions;

export default playlistSlice.reducer;
