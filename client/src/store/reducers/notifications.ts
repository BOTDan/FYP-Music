/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ToasterDefinition, ToasterType } from '../../types';

const initialState = {
  toasters: [] as ToasterDefinition[],
};

let toasterId = 0;

export const notificationsSlice = createSlice({
  name: 'Notifications',
  initialState,
  reducers: {
    addToaster(state, action: PayloadAction<Partial<ToasterDefinition>>) {
      state.toasters = [...state.toasters, {
        id: toasterId,
        type: action.payload.type ?? ToasterType.Info,
        title: action.payload.title ?? '',
        description: action.payload.description,
        lifetime: action.payload.lifetime ?? 10000,
        created: action.payload.created ?? Date.now(),
      }];
      toasterId += 1;
    },
    addErrorToaster(state, action: PayloadAction<any>) {
      state.toasters = [...state.toasters, {
        id: toasterId,
        type: ToasterType.Danger,
        title: 'Error',
        description: `${action.payload.name}`,
        lifetime: 10000,
        created: Date.now(),
      }];
      toasterId += 1;
    },
    removeToaster(state, action: PayloadAction<ToasterDefinition>) {
      state.toasters = state.toasters.filter((toast) => toast.id !== action.payload.id);
    },
  },
});

export const { addToaster, addErrorToaster, removeToaster } = notificationsSlice.actions;

export default notificationsSlice.reducer;
