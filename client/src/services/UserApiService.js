// src/services/ApiService.js
import axios from 'axios';
import { API_BASE_URL } from '../config/config';
const authApi = axios.create({
  baseURL: API_BASE_URL + '/auth',
  withCredentials: true,
});

authApi.interceptors.request.use(config => {
  // Add auth token to headers if available
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

authApi.interceptors.response.use(
  response => response,
  error => {
    console.error('Error details:', error);
    return Promise.reject(error);
  }
);

export default authApi;
