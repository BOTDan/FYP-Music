/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserTokenDTO } from '../../types/public';

interface AuthState {
  token: UserTokenDTO | undefined
}

const initialState: AuthState = {
  token: undefined,
};

export enum AuthStoreActions {
  UPDATE_TOKEN = 'UPDATE_TOKEN',
}

export const authSlice = createSlice({
  name: 'Auth',
  initialState,
  reducers: {
    updateToken: (state, action: PayloadAction<UserTokenDTO | undefined>) => {
      state.token = action.payload;
    },
  },
});

export const { updateToken } = authSlice.actions;

export default authSlice.reducer;
