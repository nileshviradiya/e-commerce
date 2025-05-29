import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  registerUserApi,
  loginUserApi,
  UserRegistrationData,
  UserLoginData,
  UserData,
  AuthResponse,
} from '../api/authApi';

interface AuthState {
  user: UserData | null;
  token: string | null;
  isLoading: boolean;
  error: string | null | undefined; // Can be string or undefined from createAsyncThunk
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'), // Initialize token from localStorage
  isLoading: false,
  error: null,
};

// Async thunk for user registration
export const registerUser = createAsyncThunk<AuthResponse, UserRegistrationData, { rejectValue: string }>(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await registerUserApi(userData);
      if (!response.success) {
        return rejectWithValue(response.message || 'Registration failed');
      }
      // Assuming registration does not automatically log in the user / return a token
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'An unknown error occurred');
    }
  }
);

// Async thunk for user login
export const loginUser = createAsyncThunk<AuthResponse, UserLoginData, { rejectValue: string }>(
  'auth/loginUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await loginUserApi(userData);
      if (!response.success || !response.token || !response.data) {
        return rejectWithValue(response.message || 'Login failed');
      }
      localStorage.setItem('token', response.token);
      return response; // Contains token and user data
    } catch (error: any) {
      return rejectWithValue(error.message || 'An unknown error occurred');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isLoading = false;
      state.error = null;
      localStorage.removeItem('token');
    },
    clearError: (state) => {
      state.error = null;
    },
    // Action to potentially load user if token exists (e.g., on app load)
    setUserFromToken: (state, action: PayloadAction<{ user: UserData; token: string }>) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isLoading = false;
        state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Register user
    builder.addCase(registerUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.isLoading = false;
      // Optionally, set user data if registration returns it and logs in
      // For now, assumes registration success means user can now log in.
      // state.user = action.payload.data; 
      // state.token = action.payload.token; // If token is returned
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // Login user
    builder.addCase(loginUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload.data!;
      state.token = action.payload.token!;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
  },
});

export const { logout, clearError, setUserFromToken } = authSlice.actions;
export default authSlice.reducer;
