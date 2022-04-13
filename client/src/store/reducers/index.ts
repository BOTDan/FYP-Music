import { combineReducers } from 'redux';
import searchReducer from './search';
import authReducer from './auth';
import playlistsReducer from './playlists';

const rootReducer = combineReducers({
  search: searchReducer,
  auth: authReducer,
  playlists: playlistsReducer,
});

export default rootReducer;
