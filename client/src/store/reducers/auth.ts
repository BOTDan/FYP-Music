/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StoreObject, StoreObjectState } from '../../types';
import { AuthAccountDTO, UserTokenDTO } from '../../types/public';

const initialState = {
  token: {
    state: StoreObjectState.Uninitialized,
    value: undefined,
  } as StoreObject<UserTokenDTO>,
  accounts: [] as AuthAccountDTO[],
};

export const authSlice = createSlice({
  name: 'Auth',
  initialState,
  reducers: {
    updateToken: (state, action: PayloadAction<StoreObject<UserTokenDTO>>) => {
      state.token = action.payload;
    },
    updateAuthAccounts: (state, action: PayloadAction<AuthAccountDTO[]>) => {
      state.accounts = action.payload;
    },
    addAuthAccount: (state, action: PayloadAction<AuthAccountDTO>) => {
      state.accounts = [...state.accounts, action.payload];
    },
    removeAuthAccount: (state, action: PayloadAction<AuthAccountDTO>) => {
      state.accounts = [...state.accounts.filter((a) => a.id !== action.payload.id)];
    },
  },
});

export const {
  updateToken, updateAuthAccounts, addAuthAccount, removeAuthAccount,
} = authSlice.actions;

export default authSlice.reducer;
