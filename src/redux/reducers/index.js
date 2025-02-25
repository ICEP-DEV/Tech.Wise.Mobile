import { combineReducers} from 'redux';
import authReducer from './authReducer'; // Import your individual reducers

const rootReducer = combineReducers({
  auth: authReducer,
  // Add other reducers here
});

export default rootReducer;
