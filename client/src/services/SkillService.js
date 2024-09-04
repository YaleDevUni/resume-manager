import axios from 'axios';
import { API_BASE_URL } from '../config/config';
const skillsApi = axios.create({
  baseURL: API_BASE_URL + '/skills',
  withCredentials: true,
  // add bearer token to headers
  headers: localStorage.getItem('token') && {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});

skillsApi.interceptors.request.use(config => {
  // Add auth token to headers if available
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

skillsApi.interceptors.response.use(
  response => response,
  error => {
    console.error('Error details:', error);
    return Promise.reject(error);
  }
);

async function getSkills() {
  const storedSkills = localStorage.getItem('skills');

  if (storedSkills) {
    // Returning a resolved Promise with the split array
    return Promise.resolve(storedSkills.split(','));
  } else {
    try {
      const response = await skillsApi.get('/');
      const skills = response.data.map(data => data.skill);
      localStorage.setItem('skills', skills.join(',')); // Store as a comma-separated string
      return skills;
    } catch (error) {
      console.error('Error fetching skills:', error);
      return [];
    }
  }
}
export { getSkills, skillsApi };
