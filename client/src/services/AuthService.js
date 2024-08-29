import { jwtDecode } from 'jwt-decode';

export const getToken = () => localStorage.getItem('token');

export const isTokenExpired = token => {
  try {
    const { exp } = jwtDecode(token);
    // Check if the token is expired (exp is in seconds, Date.now() returns milliseconds)
    if (exp < Date.now() / 1000) {
      return true;
    }
    return false;
  } catch (error) {
    // Error in decoding token (e.g., malformed token)
    return true;
  }
};

export const isAuthenticated = () => {
  const token = getToken();
  // Check for token presence and validate that it hasn't expired
  return token && !isTokenExpired(token);
};

export const logout = () => {
  localStorage.removeItem('token');
};
