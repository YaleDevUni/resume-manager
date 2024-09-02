import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  createRecruitment,
  getAllRecruitments,
  getRecruitmentById,
  updateRecruitmentById,
  deleteRecruitmentById,
} from './recruitApi';

// Async actions

// CREATE - Add a new recruitment
export const createRecruitmentAsync = createAsyncThunk(
  'recruitment/createRecruitment',
  async (recruitmentData, { rejectWithValue }) => {
    try {
      const response = await createRecruitment(recruitmentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create recruitment'
      );
    }
  }
);

// READ - Get all recruitments with pagination
export const fetchAllRecruitments = createAsyncThunk(
  'recruitment/fetchAllRecruitments',
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const response = await getAllRecruitments(page, limit);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch recruitments'
      );
    }
  }
);

// READ - Get a recruitment by ID
export const fetchRecruitmentById = createAsyncThunk(
  'recruitment/fetchRecruitmentById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await getRecruitmentById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch recruitment'
      );
    }
  }
);

// UPDATE - Update a recruitment by ID
export const updateRecruitmentAsync = createAsyncThunk(
  'recruitment/updateRecruitment',
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const response = await updateRecruitmentById(id, updatedData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update recruitment'
      );
    }
  }
);

// DELETE - Delete a recruitment by ID
export const deleteRecruitmentAsync = createAsyncThunk(
  'recruitment/deleteRecruitment',
  async (id, { rejectWithValue }) => {
    try {
      await deleteRecruitmentById(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete recruitment'
      );
    }
  }
);

// Create recruitment slice
const recruitmentSlice = createSlice({
  name: 'recruitment',
  initialState: {
    recruitments: {
      data: [],
      status: 'idle',
      totalPages: 1,
      currentPage: 1,
      limit: 10,
    },
    recruitment: {
      data: null,
      status: 'idle',
    },
    error: null,
  },
  reducers: {
    resetError: state => {
      state.error = null;
    },
    selectRecruitment: (state, action) => {
      state.recruitment = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      // Handling recruitments list
      .addCase(fetchAllRecruitments.pending, state => {
        state.recruitments.status = 'loading';
      })
      .addCase(fetchAllRecruitments.fulfilled, (state, action) => {
        state.recruitments.status = 'succeeded';
        state.recruitments.data = action.payload.recruitments;
        state.recruitments.totalPages = action.payload.totalPages;
        state.recruitments.currentPage = Number(action.payload.currentPage);
      })
      .addCase(fetchAllRecruitments.rejected, (state, action) => {
        state.recruitments.status = 'failed';
        state.error = action.payload;
      })

      // Handling single recruitment
      .addCase(fetchRecruitmentById.pending, state => {
        state.recruitment.status = 'loading';
      })
      .addCase(fetchRecruitmentById.fulfilled, (state, action) => {
        state.recruitment.status = 'succeeded';
        state.recruitment.data = action.payload;
      })
      .addCase(fetchRecruitmentById.rejected, (state, action) => {
        state.recruitment.status = 'failed';
        state.error = action.payload;
      })
      // createRecruitment
      .addCase(createRecruitmentAsync.pending, state => {
        state.recruitment.status = 'loading';
      })
      .addCase(createRecruitmentAsync.fulfilled, (state, action) => {
        state.recruitment.status = 'succeeded';
        state.recruitment.data = action.payload;
      })
      .addCase(createRecruitmentAsync.rejected, (state, action) => {
        state.recruitment.status = 'failed';
        state.error = action.payload;
      })
      // updateRecruitment
      .addCase(updateRecruitmentAsync.pending, state => {
        state.recruitment.status = 'loading';
      })
      .addCase(updateRecruitmentAsync.fulfilled, (state, action) => {
        state.recruitment.status = 'succeeded';
        state.recruitment.data = action.payload;
      })
      .addCase(updateRecruitmentAsync.rejected, (state, action) => {
        state.recruitment.status = 'failed';
        state.error = action.payload;
      })
      // deleteRecruitment
      .addCase(deleteRecruitmentAsync.pending, state => {
        state.recruitment.status = 'loading';
      })
      .addCase(deleteRecruitmentAsync.fulfilled, (state, action) => {
        state.recruitment.status = 'succeeded';
        state.recruitment.data = null;
      })
      .addCase(deleteRecruitmentAsync.rejected, (state, action) => {
        state.recruitment.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { resetError, selectRecruitment } = recruitmentSlice.actions;
export default recruitmentSlice.reducer;
