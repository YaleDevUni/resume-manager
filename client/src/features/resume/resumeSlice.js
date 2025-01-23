// src/features/resume/resumeSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllResumes, getResumeById, updateResumeData, deleteResumeById } from './resumeApi';

// Async actions
export const removeResumeById = createAsyncThunk(
  'resume/removeResumeById',
  async (resumeId, { rejectWithValue }) => {
    try {
      const response = await deleteResumeById(resumeId);
      if (response.status === 200) {
        return resumeId; // Just return the ID if deletion was successful
      }
      throw new Error('Delete operation failed');
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete resume'
      );
    }
  }
);

export const fetchResumes = createAsyncThunk(
  'resume/fetchResumes',
  async (params, { rejectWithValue }) => {
    try {
      const response = await getAllResumes(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch resumes'
      );
    }
  }
);

export const fetchResumeById = createAsyncThunk(
  'resume/fetchResumeById',
  async (resumeId, { rejectWithValue }) => {
    try {
      const response = await getResumeById(resumeId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch resume'
      );
    }
  }
);
export const updateResumeById = createAsyncThunk(
  'resume/updateResumeById',
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const response = await updateResumeData(id, updatedData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update resume'
      );
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
      pagination: {},
      error: null,
    },
    resume: {
      data: {},
      status: 'idle',
      error: null,
    },
    pdf: {
      data: null,
    },
  },
  reducers: {
    resetListError: state => {
      state.resumes.error = null;
    },
    resetResumeError: state => {
      state.resume.error = null;
    },
    setResumeList: (state, action) => {
      state.resumes.data = action.payload;
    },
    setResume: (state, action) => {
      state.resume.data = action.payload;
    },
    setPdf: (state, action) => {
      state.pdf.data = action.payload;
    },
    clearPdf: state => {
      state.pdf.data = null;
    }
  },
  extraReducers: builder => {
    // Fetch all resumes
    builder.addCase(fetchResumes.pending, state => {
      state.resumes.status = 'loading';
    });
    builder.addCase(fetchResumes.fulfilled, (state, action) => {
      state.resumes.status = 'succeeded';
      state.resumes.data = action.payload.data;
      state.resumes.pagination = action.payload.pagination;
    });
    builder.addCase(fetchResumes.rejected, (state, action) => {
      state.resumes.status = 'failed';
      state.resumes.error = action.payload.message;
    });
    // Fetch resume by ID
    builder.addCase(fetchResumeById.pending, state => {
      state.resume.status = 'loading';
    });
    builder.addCase(fetchResumeById.fulfilled, (state, action) => {
      state.resume.status = 'succeeded';
      state.resume.data = action.payload;
    });
    builder.addCase(fetchResumeById.rejected, (state, action) => {
      state.resume.status = 'failed';
      state.resume.error = action.payload.message;
    });
    // Update resume by ID
    builder.addCase(updateResumeById.pending, state => {
      state.resume.status = 'loading';
    });
    builder.addCase(updateResumeById.fulfilled, (state, action) => {
      state.resume.status = 'succeeded';
      state.resume.data = action.payload;
    });
    builder.addCase(updateResumeById.rejected, (state, action) => {
      state.resume.status = 'failed';
      state.resume.error = action.payload.message;
    });
    // Delete resume cases
    builder.addCase(removeResumeById.pending, state => {
      state.resumes.status = 'loading';
    });
    builder.addCase(removeResumeById.fulfilled, (state, action) => {
      state.resumes.status = 'succeeded';
      // Filter out the deleted resume locally
      state.resumes.data = state.resumes.data.filter(
        resume => resume._id !== action.payload
      );
    });
    builder.addCase(removeResumeById.rejected, (state, action) => {
      state.resumes.status = 'failed';
      state.resumes.error = action.payload;
    });
  },
});

export const { resetListError, resetResumeError, setResumeList, setPdf, clearPdf } =
  resumeSlice.actions;
export default resumeSlice.reducer;
