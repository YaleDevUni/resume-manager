// src/features/user/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser, registerUser, updateUser, logoutUser } from './userApi';

// Async actions
export const register = createAsyncThunk(
  'user/register',
  async ({ username, password }, { rejectWithValue }) => {
    // FIXME: Remove after testing
    // await new Promise(resolve => setTimeout(resolve, 500));
    try {
      const response = await registerUser(username, password);
      return response.data;
    } catch (error) {
      // check error.response.data is string or object
      if (typeof error.response.data === 'string')
        return rejectWithValue(error.response.data);
      else
        return rejectWithValue(
          error.response?.data?.message || 'Unknown error'
        );
    }
  }
);
export const login = createAsyncThunk(
  'user/login',
  async ({ username, password }, { rejectWithValue }) => {
    // FIXME: Remove after testing
    // await new Promise(resolve => setTimeout(resolve, 500));
    try {
      const response = await loginUser(username, password);
      return response.data;
    } catch (error) {
      // check status code and return error message
      if (error.response.status === 401)
        return rejectWithValue('Invalid username or password');
      else if (typeof error.response.data === 'string')
        return rejectWithValue(error.response.data);
      else
        return rejectWithValue(
          error.response?.data?.message || 'Unknown error'
        );
    }
  }
);

// Create user slice
const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    status: 'idle',
    isLoggedIn: false,
    token: null,
    error: null,
  },
  reducers: {
    resetError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(register.pending, state => {
        state.status = 'loading';
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(login.pending, state => {
        state.status = 'loading';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isLoggedIn = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { resetError } = userSlice.actions;
export default userSlice.reducer;
