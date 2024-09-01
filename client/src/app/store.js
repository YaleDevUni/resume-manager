import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice';
import recruitmentReducer from '../features/recruitment/recruitSlice'; // Import the recruitment reducer

const store = configureStore({
  reducer: {
    user: userReducer,
    recruitment: recruitmentReducer,
  },
});

export default store;
