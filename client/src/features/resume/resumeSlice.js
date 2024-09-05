// src/features/resume/resumeSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllResumes } from './resumeApi';

// Async actions
export const fetchResumes = createAsyncThunk(
  'resume/fetchResumes',
  async ({ page, limit }) => {
    try {
      const response = await getAllResumes(page, limit);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }
);

// Create resume slice
const resumeSlice = createSlice({
  name: 'resume',
  initialState: {
    resumes: {
      data: [],
      status: 'idle',
      error: null,
    },
    resume: {
      data: {},
      status: 'idle',
      error: null,
    },
  },
  reducers: {
    resetListError: state => {
      state.resumes.error = null;
    },
    resetResumeError: state => {
      state.resume.error = null;
    },
  },
  extraReducers: {
    [fetchResumes.pending]: state => {
      state.resumes.status = 'loading';
    },
    [fetchResumes.fulfilled]: (state, action) => {
      state.resumes.data = action.payload;
      state.resumes.status = 'succeeded';
    },
    [fetchResumes.rejected]: (state, action) => {
      state.resumes.error = action.payload;
      state.resumes.status = 'failed';
    },
  },
});

export const { resetListError, resetResumeError } = resumeSlice.actions;
export default resumeSlice.reducer;
