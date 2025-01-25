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

export const resetPassword = async (code, password, email) => {
  return await authApi.post('/reset-password', { code, password, email });
};

export const forgotPassword = async email => {
  return await authApi.post('/forgot-password', { email });
};
export const changePassword = async (email, password, newPassword) => {
  return await authApi.post('/change-password', {
    email,
    password,
    newPassword,
  });
};
export const resendVerification = async email => {
  return await authApi.post('/resend-verification', { email });
};

export const getMe = async () => {
  return await authApi.get('/me');
};
