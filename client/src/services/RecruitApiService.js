import axios from 'axios';
import { API_BASE_URL } from '../config/config';
const recruitmentApi = axios.create({
  baseURL: API_BASE_URL + '/recruitments',
  withCredentials: true,
});
recruitmentApi.interceptors.request.use(config => {
  // Add auth token to headers if available
  const token = localStorage.getItem('token');
  console.log('Token:', token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

recruitmentApi.interceptors.response.use(
  response => response,
  error => {
    console.error('Error details:', error);
    return Promise.reject(error);
  }
);

export default recruitmentApi;
