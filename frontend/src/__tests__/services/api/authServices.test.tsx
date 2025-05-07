// __tests__/authServices.test.ts

jest.mock('axios', () => ({
  create: jest.fn(function(this: any) { return this; }),
  get: jest.fn(),
  post: jest.fn(),
  defaults: { baseURL: '' },
  interceptors: {
    request: { use: jest.fn(), eject: jest.fn() },
    response: { use: jest.fn(), eject: jest.fn() }
  }
}));

// Get the mocked axios instance
const mockedAxios = jest.requireMock('axios');

import {
  handleApiError,
  getCsrfToken,
  login,
  logout,
  getUser,
  registerUser,
  authCheck,
  emailVerification
} from '../../../services/api/authServices';

interface ApiResponse {
  status: number;
  data: {
    message?: string;
    user?: any;
    authenticated?: boolean;
    email_verified?: boolean;
    [key: string]: any;
  };
}

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock document.cookie
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: 'XSRF-TOKEN=test-csrf-token',
    });
  });

  const testErrorHandling = async (
    apiFunction: Function, 
    args: any[] = [], 
    method: 'get' | 'post' = 'get', 
    errorType: 'response' | 'request' | 'message' = 'response', 
    status = 500
  ) => {
    const error: any = { 
      [errorType]: errorType === 'response' ? { 
        status, 
        data: { message: 'Test error message' } 
      } : {}
    };
    
    if (errorType === 'request') {
      error.request = {};
    } else if (errorType === 'message') {
      error.message = 'Test error message';
    }
    
    mockedAxios[method].mockRejectedValueOnce(error);
    
    await expect(apiFunction(...args)).rejects.toThrow();
  };

  describe('handleApiError', () => {
    it('should handle 400 error', () => {
      const error = { response: { status: 400 } };
      expect(() => handleApiError(error)).toThrow('Bad request');
    });

    it('should handle 401 error', () => {
      const error = { response: { status: 401 } };
      expect(() => handleApiError(error)).toThrow('Unauthorized');
    });

    it('should handle 403 error', () => {
      const error = { response: { status: 403 } };
      expect(() => handleApiError(error)).toThrow('Forbidden');
    });

    it('should handle 404 error', () => {
      const error = { response: { status: 404 } };
      expect(() => handleApiError(error)).toThrow('Resource not found');
    });

    it('should handle 422 error', () => {
      const error = { response: { status: 422, data: { message: 'Validation failed' } } };
      expect(() => handleApiError(error)).toThrow('Validation failed');
    });

    it('should handle 500 error', () => {
      const error = { response: { status: 500 } };
      expect(() => handleApiError(error)).toThrow('Server error');
    });

    it('should handle default error with message', () => {
      const error = { response: { status: 999, data: { message: 'Custom error' } } };
      expect(() => handleApiError(error)).toThrow('Custom error');
    });

    it('should handle default error without message', () => {
      const error = { response: { status: 999, data: {} } };
      expect(() => handleApiError(error)).toThrow('An error occurred');
    });

    it('should handle request error', () => {
      const error = { request: {} };
      expect(() => handleApiError(error)).toThrow('No response from server');
    });

    it('should handle unexpected error', () => {
      const error = { message: 'Unexpected error' };
      expect(() => handleApiError(error)).toThrow('Unexpected error: Unexpected error');
    });
  });

  describe('getCsrfToken', () => {
    it('should fetch CSRF token successfully', async () => {
      mockedAxios.get.mockResolvedValueOnce({});
      
      await getCsrfToken();
      
      expect(mockedAxios.get).toHaveBeenCalledWith('sanctum/csrf-cookie');
      expect(document.cookie).toContain('XSRF-TOKEN=test-csrf-token');
    });

    it('should handle error when fetching CSRF token', async () => {
      await testErrorHandling(getCsrfToken);
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      // Mock getCsrfToken
      mockedAxios.get.mockResolvedValueOnce({});
      
      // Mock login request
      const mockResponse: ApiResponse = { 
        status: 200,
        data: { user: { id: 1, name: 'Test User' } } 
      };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);
      
      const result = await login('test@example.com', 'password');
      
      expect(mockedAxios.get).toHaveBeenCalledWith('sanctum/csrf-cookie');
      expect(mockedAxios.post).toHaveBeenCalledWith('api/login', { 
        email: 'test@example.com', 
        password: 'password' 
      });
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle login error', async () => {
      mockedAxios.get.mockResolvedValueOnce({}); // Mock getCsrfToken success
      await testErrorHandling(login, ['test@example.com', 'password'], 'post');
    });
  });

  describe('logout', () => {
    it('should logout user successfully', async () => {
      const mockResponse: ApiResponse = { 
        status: 200,
        data: { message: 'Logged out successfully' } 
      };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);
      
      const result = await logout();
      
      expect(mockedAxios.post).toHaveBeenCalledWith('api/logout');
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle logout error', async () => {
      await testErrorHandling(logout, [], 'post');
    });
  });

  describe('getUser', () => {
    it('should get user data successfully', async () => {
      const mockResponse: ApiResponse = { 
        status: 200,
        data: { user: { id: 1, name: 'Test User' } } 
      };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);
      
      const result = await getUser();
      
      expect(mockedAxios.get).toHaveBeenCalledWith('api/v1/user');
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle getUser error', async () => {
      await testErrorHandling(getUser);
    });
  });

  describe('registerUser', () => {
    it('should register user successfully', async () => {
      // Mock getCsrfToken
      mockedAxios.get.mockResolvedValueOnce({});
      
      // Mock register request
      const userData = { name: 'New User', email: 'new@example.com', password: 'password', password_confirmation: 'password' };
      const mockResponse: ApiResponse = { 
        status: 200,
        data: { user: { id: 1, name: 'New User' }, message: 'Registration successful' } 
      };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);
      
      const result = await registerUser(userData);
      
      expect(mockedAxios.get).toHaveBeenCalledWith('sanctum/csrf-cookie');
      expect(mockedAxios.post).toHaveBeenCalledWith('api/register', userData);
      expect(result).toEqual(mockResponse);
    });

    it('should handle registration error', async () => {
      const userData = { name: 'New User', email: 'new@example.com', password: 'password' };
      mockedAxios.get.mockResolvedValueOnce({}); // Mock getCsrfToken success
      await testErrorHandling(registerUser, [userData], 'post');
    });
  });

  describe('authCheck', () => {
    it('should check auth status successfully', async () => {
      const mockResponse: ApiResponse = { 
        status: 200,
        data: { authenticated: true, email_verified: true } 
      };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);
      
      const result = await authCheck();
      
      expect(mockedAxios.get).toHaveBeenCalledWith('api/auth-status');
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle authCheck error', async () => {
      await testErrorHandling(authCheck);
    });
  });

  describe('emailVerification', () => {
    it('should send verification email successfully', async () => {
      const mockResponse: ApiResponse = { 
        status: 200,
        data: { message: 'Verification link sent' } 
      };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);
      
      const result = await emailVerification();
      
      expect(mockedAxios.post).toHaveBeenCalledWith('api/email/verification-notification');
      expect(result).toEqual(mockResponse);
    });

    it('should handle emailVerification error', async () => {
      await testErrorHandling(emailVerification, [], 'post');
    });
  });
});