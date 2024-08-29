import axios from 'axios';

/**
 * User class to handle user authentication and management.
 * @class
 * @example
 * const user = new User();
 * const res = await user.login(username, password);
 */
class User {
  constructor() {
    this.api = axios.create({
      baseURL: 'http://localhost:3003/api/auth',
      withCredentials: true,
      // include credential if needed for auth-protected routes
    });

    this.api.interceptors.response.use(
      response => response, // handle successful response
      error => this.handleError(error) // centralized error handling
    );
  }

  /**
   * Centralized error handling for all API responses.
   * @private
   * @param {Object} error - Axios error object
   */
  handleError(error) {
    console.error('Error details:', error);
    return Promise.reject(error.response);
  }

  /**
   * Logs in a user with the given username and password.
   * @param {string} username
   * @param {string} password
   * @returns {Promise<Object>} - API response
   */
  async login(username, password) {
    const res = await this.api.post('/login', { username, password });

    return res;
  }

  /**
   * Registers a user with the given username and password.
   * @param {string} username
   * @param {string} password
   * @returns {Promise<Object>} - API response containing the created user
   */
  async register(username, password) {
    return this.api.post('/register', { username, password });
  }

  /**
   * Updates the current user.
   * @param {Object} updatedUser - Updated user data
   * @returns {Promise<Object>} - API response containing the updated user
   */
  async update(updatedUser) {
    return this.api.put(`/${updatedUser.id}`, updatedUser);
  }

  /**
   * Logs out the current user.
   * @returns {Promise<Object>} - API response indicating the logout status
   */
  async logout() {
    return this.api.post('/logout');
  }
}

export default User;
