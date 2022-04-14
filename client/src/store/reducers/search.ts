/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MediaProvider } from '../../types/public';

interface SearchState {
  provider: MediaProvider;
  q: string;
  doSearch: boolean;
}

const initialState: SearchState = {
  provider: MediaProvider.YouTube,
  q: '',
  doSearch: false,
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
    updateDoSearch: (state, action: PayloadAction<boolean>) => {
      state.doSearch = action.payload;
    },
  },
});

export const { updateProvider, updateSearchTerm, updateDoSearch } = searchSlice.actions;

export default searchSlice.reducer;
