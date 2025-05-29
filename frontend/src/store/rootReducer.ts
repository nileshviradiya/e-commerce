import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/store/authSlice';

// If you have other feature reducers, you can add them here
const rootReducer = combineReducers({
  auth: authReducer,
  // otherFeature: otherFeatureReducer,
});

// This RootState type might not be directly used if store.getState is preferred,
// but it's good for defining the shape of the combined root reducer.
export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
