import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice';
import recruitmentReducer from '../features/recruitment/recruitSlice'; // Import the recruitment reducer
import resumeReducer from '../features/resume/resumeSlice'; // Import the resume reducer
const store = configureStore({
  reducer: {
    user: userReducer,
    recruitment: recruitmentReducer,
    resume: resumeReducer,
  },
});

export default store;
