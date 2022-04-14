/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StoreObject, StoreObjectState } from '../../types';
import { UserTokenDTO } from '../../types/public';
// eslint-disable-next-line import/no-cycle

const initialState = {
  token: {
    state: StoreObjectState.Uninitialized,
    value: undefined,
  } as StoreObject<UserTokenDTO>,
};

export const authSlice = createSlice({
  name: 'Auth',
  initialState,
  reducers: {
    updateToken: (state, action: PayloadAction<StoreObject<UserTokenDTO>>) => {
      state.token = action.payload;
    },
  },
});

export const { updateToken } = authSlice.actions;

export default authSlice.reducer;
