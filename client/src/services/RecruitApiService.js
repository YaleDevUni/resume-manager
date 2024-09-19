import axios from 'axios';
import { API_BASE_URL } from '../config/config';
const recruitmentApi = axios.create({
  baseURL: API_BASE_URL + '/recruitments',
  withCredentials: true,
});
recruitmentApi.interceptors.request.use(config => {
  // Add auth token to headers if available
  const token = localStorage.getItem('token');
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

async function searchRecruitments(searchTerm) {
  try {
    const response = await recruitmentApi.get('search', {
      params: { q: searchTerm }, // Changed 'search' to 'q' to match the req.query.q usage
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching recruitments:', error);
    return [];
  }
}

export default recruitmentApi;
export { searchRecruitments };
