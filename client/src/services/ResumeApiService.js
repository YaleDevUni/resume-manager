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


async function uploadBulkResumes(pdfs, recruitment_id) {
  try {
    // Create a FormData object
    const formData = new FormData();

    // Append each PDF file to the FormData object
    pdfs.forEach((pdf, index) => {
      formData.append(`pdfs`, pdf);
    });

    // Append the recruitment_id
    formData.append('recruitment_id', recruitment_id);

    // Make the POST request
    const response = await authApi.post('', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error uploading resumes:', error);
    return [];
  }
}
export { uploadBulkResumes };
export default authApi;
