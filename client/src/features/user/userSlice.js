import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  loginUser,
  registerUser,
  updateUser,
  logoutUser,
  getMe,
} from './userApi';

// Initial state that checks localStorage
const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  status: 'idle',
  isLoggedIn: !!localStorage.getItem('token'),
  token: localStorage.getItem('token'),
  error: null,
  verificationStatus: 'idle',
};

// Async actions
export const register = createAsyncThunk(
  'user/register',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await registerUser(email, password);
      return response.data;
    } catch (error) {
      if (typeof error.response.data === 'string')
        return rejectWithValue(error.response.data);
      return rejectWithValue(error.response?.data?.message || 'Unknown error');
    }
  }
);

export const login = createAsyncThunk(
  'user/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await loginUser(email, password);
      // Store token and user in localStorage on successful login
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    } catch (error) {
      if (error.response.status === 401) {
        if (error.response.data?.message?.includes('verify your email')) {
          return rejectWithValue('Please verify your email before logging in');
        }
        if (error.response.data?.message === 'VERIFY') {
          return rejectWithValue('VERIFY');
        }
        return rejectWithValue('Invalid email or password');
      }
      return rejectWithValue(error.response?.data?.message || 'Unknown error');
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'user/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getMe();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch user data'
      );
    }
  }
);

export const logout = createAsyncThunk('user/logout', async () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  return null;
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetError: state => {
      state.error = null;
    },
    resetVerificationStatus: state => {
      state.verificationStatus = 'idle';
    },
  },
  extraReducers: builder => {
    builder
      .addCase(register.pending, state => {
        state.status = 'loading';
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.verificationStatus = 'pending';
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
      })
      .addCase(fetchCurrentUser.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.isLoggedIn = true;
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(logout.fulfilled, state => {
        state.user = null;
        state.token = null;
        state.isLoggedIn = false;
        state.status = 'idle';
      });
  },
});

export const { resetError, resetVerificationStatus } = userSlice.actions;
export default userSlice.reducer;
