import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { useAuth } from '../../hooks/useAuth';
import * as authServices from '../../services/api/authServices';

// Mock the auth services
jest.mock('../../services/api/authServices', () => ({
  authCheck: jest.fn(),
  getUser: jest.fn(),
}));

// Wrapper component that uses the hook and renders its state
const HookWrapper: React.FC = () => {
  const { isAuthenticated, isVerified, loading } = useAuth();
  return (
    <div>
      <div data-testid="auth-status">
        {loading ? 'Loading' : isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
      </div>
      <div data-testid="verification-status">
        {isVerified ? 'Verified' : 'Not Verified'}
      </div>
    </div>
  );
};

describe('useAuth hook', () => {
  // Clear mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show "Not Authenticated" when authentication fails', async () => {
    // Mock the authCheck function to throw an error
    (authServices.authCheck as jest.Mock).mockRejectedValue(new Error('Auth failed'));
    
    render(<HookWrapper />);
    
    // Initially should show loading
    expect(screen.getByTestId('auth-status').textContent).toBe('Loading');
    
    // Wait for the API call to complete
    await waitFor(() => {
      expect(screen.getByTestId('auth-status').textContent).toBe('Not Authenticated');
    });
    
    expect(screen.getByTestId('verification-status').textContent).toBe('Not Verified');
    expect(authServices.authCheck).toHaveBeenCalledTimes(1);
  });

  it('should show "Authenticated" and "Verified" when authentication succeeds with verified email', async () => {
    // Mock successful authentication with verified email
    (authServices.authCheck as jest.Mock).mockResolvedValue({ 
      authenticated: true, 
      email_verified: true 
    });
    
    render(<HookWrapper />);
    
    // Wait for the API call to complete
    await waitFor(() => {
      expect(screen.getByTestId('auth-status').textContent).toBe('Authenticated');
    });
    
    expect(screen.getByTestId('verification-status').textContent).toBe('Verified');
    expect(authServices.authCheck).toHaveBeenCalledTimes(1);
  });

  it('should show "Authenticated" but "Not Verified" when email is not verified', async () => {
    // Mock successful authentication with unverified email
    (authServices.authCheck as jest.Mock).mockResolvedValue({ 
      authenticated: true, 
      email_verified: false 
    });
    
    render(<HookWrapper />);
    
    // Wait for the API call to complete
    await waitFor(() => {
      expect(screen.getByTestId('auth-status').textContent).toBe('Authenticated');
    });
    
    expect(screen.getByTestId('verification-status').textContent).toBe('Not Verified');
    expect(authServices.authCheck).toHaveBeenCalledTimes(1);
  });

  it('should set loading to false after auth check completes', async () => {
    // Mock successful authentication
    (authServices.authCheck as jest.Mock).mockResolvedValue({ 
      authenticated: true, 
      email_verified: true 
    });
    
    render(<HookWrapper />);
    
    // Initially should show loading
    expect(screen.getByTestId('auth-status').textContent).toBe('Loading');
    
    // After API call completes, loading should be false
    await waitFor(() => {
      expect(screen.getByTestId('auth-status').textContent).not.toBe('Loading');
    });
  });
});

