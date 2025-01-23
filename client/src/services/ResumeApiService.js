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
async function getPdfById(id) {
  try {
    const response = await resumeApi.get(`pdf/${id}`, {
      responseType: 'arraybuffer', // Add this line
    });
    return response; // Return the whole response, not just data
  } catch (error) {
    console.error('Error fetching pdf:', error);
    throw error; // Better to throw error than return empty array for PDF fetch
  }
}

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

async function searchByOriginalFileName(searchTerm) {
  try {
    const response = await resumeApi.get('/searchByFileName', {
      params: { q: searchTerm },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching applicants:', error);
    return [];
  }
}
export { uploadBulkResumes, searchByOriginalFileName, getPdfById };
export default resumeApi;
