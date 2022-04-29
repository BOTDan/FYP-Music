import { combineReducers } from 'redux';
import searchReducer from './search';
import authReducer from './auth';
import playlistsReducer from './playlists2';
import playbackReducer from './playback';

const rootReducer = combineReducers({
  search: searchReducer,
  auth: authReducer,
  playlists: playlistsReducer,
  playback: playbackReducer,
});

export default rootReducer;
