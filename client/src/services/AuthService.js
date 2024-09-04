import { jwtDecode } from 'jwt-decode';

export const getToken = () => localStorage.getItem('token');

export const isTokenExpired = token => {
  try {
    const { exp } = jwtDecode(token);
    // Check if the token is expired (exp is in seconds, Date.now() returns milliseconds)
    console.log(jwtDecode(token));
    if (exp < Date.now() / 1000) {
      console.log('Token expired');
      return true;
    }
    return false;
  } catch (error) {
    // Error in decoding token (e.g., malformed token)
    return true;
  }
};
export const getUser = () => {
  const token = getToken();
  if (token) {
    const user = jwtDecode(token);
    return user;
  }
  return null;
};

export const isAuthenticated = () => {
  const token = getToken();
  console.log(token);
  console.log(localStorage.getItem('token'));
  // Check for token presence and validate that it hasn't expired
  return token && !isTokenExpired(token);
};

export const logout = () => {
  localStorage.removeItem('token');
};
