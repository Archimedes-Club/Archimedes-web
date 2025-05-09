import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProtectedRoute from '../ProtectedRoute';

// Create a mock for the useAuth hook
jest.mock('../hooks/useAuth', () => ({
  useAuth: jest.fn()
}));

// Create a mock for the Navigate component
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  Navigate: (props) => {
    mockNavigate(props);
    return null;
  }
}));

// Import the mocked useAuth
import { useAuth } from '../hooks/useAuth';

describe('ProtectedRoute Component', () => {
  const mockedUseAuth = useAuth as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading state when auth is loading', () => {
    // Mock the auth hook to return loading state
    mockedUseAuth.mockReturnValue({
      isAuthenticated: false,
      isVerified: false,
      loading: true,
      user: null
    });

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('redirects to login page when user is not authenticated', () => {
    // Mock the auth hook to return unauthenticated state
    mockedUseAuth.mockReturnValue({
      isAuthenticated: false,
      isVerified: false,
      loading: false,
      user: null
    });

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    // Check Navigate was called with correct props
    expect(mockNavigate).toHaveBeenCalledWith(expect.objectContaining({
      to: '/login',
      replace: true
    }));
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('redirects to verify-email page when user is authenticated but not verified', () => {
    // Mock the auth hook to return authenticated but not verified state
    mockedUseAuth.mockReturnValue({
      isAuthenticated: true,
      isVerified: false,
      loading: false,
      user: { id: '1', name: 'Test User' }
    });

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    // Check Navigate was called with correct props
    expect(mockNavigate).toHaveBeenCalledWith(expect.objectContaining({
      to: '/verify-email',
      replace: true
    }));
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('renders children when user is authenticated and verified', () => {
    // Mock the auth hook to return fully authenticated state
    mockedUseAuth.mockReturnValue({
      isAuthenticated: true,
      isVerified: true,
      loading: false,
      user: { id: '1', name: 'Test User' }
    });

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('renders children when user is authenticated and verification is not required', () => {
    // Mock the auth hook to return authenticated but not verified state
    mockedUseAuth.mockReturnValue({
      isAuthenticated: true,
      isVerified: false,
      loading: false,
      user: { id: '1', name: 'Test User' }
    });

    render(
      <ProtectedRoute requireVerified={false}>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});