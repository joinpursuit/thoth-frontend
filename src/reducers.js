import { combineReducers } from 'redux';
import { reducer as toastrReducer } from 'react-redux-toastr';

export default combineReducers({
  // ... your other reducers here ...
  toastr: toastrReducer // <- Mounted at toastr.
});
