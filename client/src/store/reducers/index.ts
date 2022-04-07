import { combineReducers } from 'redux';
import searchReducer from './search';
import authReducer from './auth';

const rootReducer = combineReducers({
  search: searchReducer,
  auth: authReducer,
});

export default rootReducer;
