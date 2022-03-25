/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MediaProvider } from '../../types';

interface SearchState {
  provider: MediaProvider,
  q: string;
}

const initialState: SearchState = {
  provider: MediaProvider.YouTube,
  q: '',
};

export enum SearchStoreActions {
  UPDATE_PROVIDER = 'UPDATE_PROVIDER',
  UPDATE_SEARCH_TERM = 'UPDATE_SEARCH_TERM',
}

export const searchSlice = createSlice({
  name: 'Search',
  initialState,
  reducers: {
    updateProvider: (state, action: PayloadAction<MediaProvider>) => {
      state.provider = action.payload;
    },
    updateSearchTerm: (state, action: PayloadAction<string>) => {
      state.q = action.payload;
    },
  },
});

export const { updateProvider, updateSearchTerm } = searchSlice.actions;

export default searchSlice.reducer;
