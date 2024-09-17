// src/services/ApiService.js
import axios from 'axios';
import { API_BASE_URL } from '../config/config';
const resumeApi = axios.create({
  baseURL: API_BASE_URL + '/resumes',
  withCredentials: true,
});
// add bearer token to headers
resumeApi.interceptors.request.use(
  config => {
    const accessToken = localStorage.getItem('token');
    if (accessToken) {
      config.headers['Authorization'] = 'Bearer ' + accessToken;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);
resumeApi.interceptors.response.use(
  response => response,
  error => {
    console.error('Error details:', error);
    return Promise.reject(error);
  }
);

async function uploadBulkResumes(pdfs, recruitment) {
  try {
    // Create a FormData object
    const formData = new FormData();

    // Append each PDF file to the FormData object
    pdfs.forEach((pdf, index) => {
      formData.append(`pdfs`, pdf);
    });

    // Append the recruitment_id
    formData.append('recruitment', recruitment);

    // Make the POST request
    const response = await resumeApi.post('', formData, {
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

async function searchApplicants(searchTerm) {
  try {
    const response = await resumeApi.get('/searchApplicant', {
      params: { q: searchTerm },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching applicants:', error);
    return [];
  }
}
export { uploadBulkResumes, searchApplicants };
export default resumeApi;
