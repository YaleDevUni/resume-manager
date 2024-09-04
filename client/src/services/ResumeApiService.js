// src/services/ApiService.js
import axios from 'axios';
import { API_BASE_URL } from '../config/config';
const authApi = axios.create({
  baseURL: API_BASE_URL + '/resumes',
  withCredentials: true,
  // add bearer token to headers
  headers: localStorage.getItem('token') && {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});

authApi.interceptors.response.use(
  response => response,
  error => {
    console.error('Error details:', error);
    return Promise.reject(error);
  }
);

// upload bulk resumes
async function uploadBulkResumes(pdfs, recruitment_id) {
  try {
    const response = await authApi.post('', { pdfs, recruitment_id });
    return response.data;
  } catch (error) {
    console.error('Error uploading resumes:', error);
    return [];
  }
}

export { uploadBulkResumes };
export default authApi;
