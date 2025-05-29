import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer'; // Will update this to include authReducer
import authReducer from '../features/auth/store/authSlice';

const store = configureStore({
  reducer: {
    // Add other reducers here if any from rootReducer
    auth: authReducer,
    // You might want to spread reducers from rootReducer if it contains more than just a placeholder
  },
});

export type AppDispatch = typeof store.dispatch;
// Infer the `RootState` type from the store itself
export type RootState = ReturnType<typeof store.getState>;
export default store;
