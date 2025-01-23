import authApi from '../../services/UserApiService';

export const loginUser = async (email, password) => {
  return await authApi.post('/login', { email, password });
};

export const registerUser = async (email, password) => {
  return await authApi.post('/register', { email, password });
};

export const updateUser = async updatedUser => {
  return await authApi.put(`/${updatedUser.id}`, updatedUser);
};

export const logoutUser = async () => {
  return await authApi.post('/logout');
};

export const resetPassword = async (token, password) => {
  return await authApi.post('/reset-password', { token, password });
};

export const forgotPassword = async email => {
  return await authApi.post('/forgot-password', { email });
};
export const changePassword = async (email,password, newPassword) => {
  return await authApi.post('/change-password', {
    email,
    password,
    newPassword,
  });
};

export const getMe = async () => {
  return await authApi.get('/me');
};
