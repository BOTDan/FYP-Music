import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers';

const storedData = localStorage.getItem('reduxStorage');
const preloadedState = storedData !== null
  ? JSON.parse(storedData)
  : {};

const store = configureStore({
  reducer: rootReducer,
  preloadedState,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: ['Notifications/addErrorToaster'],
    },
  }),
});

export default store;
