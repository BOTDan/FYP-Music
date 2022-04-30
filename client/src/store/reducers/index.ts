import { combineReducers } from 'redux';
import searchReducer from './search';
import authReducer from './auth';
import playlistsReducer from './playlists2';
import playbackReducer from './playback';
import notificationsReducer from './notifications';

const rootReducer = combineReducers({
  search: searchReducer,
  auth: authReducer,
  playlists: playlistsReducer,
  playback: playbackReducer,
  notifications: notificationsReducer,
});

export default rootReducer;
