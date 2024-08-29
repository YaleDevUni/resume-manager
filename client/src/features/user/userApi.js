// src/features/user/userApi.js
import authApi from '../../services/UserApiService';

export const loginUser = async (username, password) => {
  return await authApi.post('/login', { username, password });
};

export const registerUser = async (username, password) => {
  return await authApi.post('/register', { username, password });
};

export const updateUser = async updatedUser => {
  return await authApi.put(`/${updatedUser.id}`, updatedUser);
};

export const logoutUser = async () => {
  return await authApi.post('/logout');
};
