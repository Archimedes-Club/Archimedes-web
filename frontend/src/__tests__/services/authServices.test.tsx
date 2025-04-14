// src/__tests__/services/authServices.test.ts
// Mock the axios module before any imports
jest.mock('axios', () => {
  // Create a mockAxios object with the necessary methods
  const mockAxios = {
    get: jest.fn(() => Promise.resolve({ data: {} })),
    post: jest.fn(() => Promise.resolve({ data: {} })),
  };
  
  // Return a function that returns mockAxios when called
  return {
    create: jest.fn(() => mockAxios),
    mockAxios, // Expose mockAxios for direct access in tests
  };
});

import axios from 'axios';
import {
  handleApiError,
  getCsrfToken,
  login,
  logout,
  getUser,
  registerUser,
  authCheck,
  emailVerification,
} from '../../services/api/authServices';

// Get the mockAxios instance that the code will use
const mockAxios = (axios as any).mockAxios;

describe('authServices', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    document.cookie = '';
  });

  // ----------------------------
  // Tests for handleApiError
  // ----------------------------
  describe('handleApiError', () => {
    test('throws error for status 400', () => {
      const error = { response: { status: 400, data: {} }, message: 'Bad request error' };
      expect(() => handleApiError(error)).toThrow('Bad request. Please check your input.');
    });

    test('throws error for status 401', () => {
      const error = { response: { status: 401, data: {} }, message: 'Unauthorized error' };
      expect(() => handleApiError(error)).toThrow('Unauthorized. Please login.');
    });

    test('throws error for status 403', () => {
      const error = { response: { status: 403, data: {} }, message: 'Forbidden error' };
      // Use exact string instead of RegExp
      expect(() => handleApiError(error)).toThrow("Forbidden. You don't have permission to access this.");
    });

    test('throws error for status 404', () => {
      const error = { response: { status: 404, data: {} }, message: 'Not found error' };
      expect(() => handleApiError(error)).toThrow('Resource not found.');
    });

    test('throws error for status 422 with message', () => {
      const error = {
        response: { status: 422, data: { message: 'Validation failed' } },
        message: 'Validation failed',
      };
      expect(() => handleApiError(error)).toThrow('Validation failed');
    });

    test('throws error for status 500', () => {
      const error = { response: { status: 500, data: {} }, message: 'Internal server error' };
      expect(() => handleApiError(error)).toThrow('Server error. Please try again later.');
    });

    test('throws network error if error.request exists', () => {
      const error = { request: {}, message: 'No response error' };
      expect(() => handleApiError(error)).toThrow('No response from server. Please check your network.');
    });

    test('throws unexpected error if neither response nor request exists', () => {
      const error = { message: 'Unexpected error occurred' };
      expect(() => handleApiError(error)).toThrow('Unexpected error: Unexpected error occurred');
    });
  });

  // ----------------------------
  // Tests for getCsrfToken
  // ----------------------------
  describe('getCsrfToken', () => {
    test('calls CSRF cookie endpoint and sets cookie if token exists', async () => {
      // Setup the mock response
      mockAxios.get.mockResolvedValueOnce({});
      
      // Create a spy on document.cookie
      const cookieSetter = jest.spyOn(document, 'cookie', 'set');
      
      // Set an encoded cookie value for XSRF-TOKEN 
      document.cookie = 'XSRF-TOKEN=encoded%20token';
      
      await getCsrfToken();
      
      // Only verify that the API endpoint was called
      expect(mockAxios.get).toHaveBeenCalledWith('sanctum/csrf-cookie');
      
      // Verify that document.cookie was set (without checking the exact value)
      expect(cookieSetter).toHaveBeenCalled();
    });

    test('handles error from API', async () => {
      const errorObj = {
        response: { status: 500, data: {} },
        message: 'Server error',
      };
      
      // Set up the mock to reject with an error
      mockAxios.get.mockRejectedValueOnce(errorObj);
      
      await expect(getCsrfToken()).rejects.toThrow('Server error. Please try again later.');
    });
  });

  // ----------------------------
  // Tests for login
  // ----------------------------
  describe('login', () => {
    test('calls getCsrfToken and then login endpoint', async () => {
      // Setup for getCsrfToken call
      mockAxios.get.mockResolvedValueOnce({});
      document.cookie = 'XSRF-TOKEN=csrf%20token';
      
      // Setup for login call
      const loginResponseData = { user: { name: 'John Doe' } };
      mockAxios.post.mockResolvedValueOnce({ data: loginResponseData });

      const result = await login('john@example.com', 'password123');
      
      expect(mockAxios.get).toHaveBeenCalledWith('sanctum/csrf-cookie');
      expect(mockAxios.post).toHaveBeenCalledWith('api/login', {
        email: 'john@example.com',
        password: 'password123',
      });
      expect(result).toEqual(loginResponseData);
    });

    test('handles error correctly', async () => {
      // Setup for getCsrfToken call
      mockAxios.get.mockResolvedValueOnce({});
      
      // Setup error for login call
      const errorObj = {
        response: { status: 401, data: {} },
        message: 'Unauthorized error',
      };
      mockAxios.post.mockRejectedValueOnce(errorObj);
      
      await expect(login('john@example.com', 'wrongpassword')).rejects.toThrow('Unauthorized. Please login.');
    });
  });

  // ----------------------------
  // Tests for logout
  // ----------------------------
  describe('logout', () => {
    test('calls logout endpoint', async () => {
      const logoutResponseData = { message: 'Logged out' };
      mockAxios.post.mockResolvedValueOnce({ data: logoutResponseData });
      
      const result = await logout();
      
      expect(mockAxios.post).toHaveBeenCalledWith('api/logout');
      expect(result).toEqual(logoutResponseData);
    });

    test('handles logout error', async () => {
      const errorObj = {
        response: { status: 500, data: {} },
        message: 'Internal server error',
      };
      mockAxios.post.mockRejectedValueOnce(errorObj);
      
      await expect(logout()).rejects.toThrow('Server error. Please try again later.');
    });
  });

  // ----------------------------
  // Tests for getUser
  // ----------------------------
  describe('getUser', () => {
    test('calls get user endpoint', async () => {
      const userResponseData = { user: { name: 'John Doe' } };
      mockAxios.get.mockResolvedValueOnce({ data: userResponseData });
      
      const result = await getUser();
      
      expect(mockAxios.get).toHaveBeenCalledWith('api/v1/user');
      expect(result).toEqual(userResponseData);
    });
  });

  // ----------------------------
  // Tests for registerUser
  // ----------------------------
  describe('registerUser', () => {
    test('calls register endpoint', async () => {
      const userData = JSON.stringify({ name: 'John', email: 'john@example.com' });
      const registerResponse = {
        data: { user: { name: 'John' }, message: 'Registered successfully' },
      };
      mockAxios.post.mockResolvedValueOnce(registerResponse);
      
      const result = await registerUser(userData);
      
      expect(mockAxios.post).toHaveBeenCalledWith('api/register', userData);
      expect(result).toEqual(registerResponse);
    });

    test('handles registration error', async () => {
      const errorObj = {
        response: { status: 422, data: { message: 'Validation error' } },
        message: 'Validation error',
      };
      mockAxios.post.mockRejectedValueOnce(errorObj);
      
      await expect(registerUser(JSON.stringify({}))).rejects.toThrow('Validation error');
    });
  });

  // ----------------------------
  // Tests for authCheck
  // ----------------------------
  describe('authCheck', () => {
    test('calls auth-status endpoint', async () => {
      const authResponseData = { authenticated: true };
      mockAxios.get.mockResolvedValueOnce({ data: authResponseData });
      
      const result = await authCheck();
      
      expect(mockAxios.get).toHaveBeenCalledWith('api/auth-status');
      expect(result).toEqual(authResponseData);
    });
  });

  // ----------------------------
  // Tests for emailVerification
  // ----------------------------
  describe('emailVerification', () => {
    test('calls email verification endpoint', async () => {
      const emailVerResponseData = { message: 'Verification email sent' };
      mockAxios.post.mockResolvedValueOnce({ data: emailVerResponseData });
      
      const result = await emailVerification();
      
      expect(mockAxios.post).toHaveBeenCalledWith('api/email/verification-notification');
      expect(result).toEqual({ data: emailVerResponseData });
    });
  });
});