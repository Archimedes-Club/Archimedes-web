import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { useAuth } from '../../hooks/useAuth';

// Wrapper component that uses the hook and renders its state
const HookWrapper: React.FC = () => {
  const { isAuthenticated } = useAuth();
  return (
    <div>
      {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
    </div>
  );
};

describe('useAuth hook', () => {
  // Clear localStorage before each test
  beforeEach(() => {
    localStorage.clear();
  });

  it('should show "Not Authenticated" when no token is present', () => {
    render(<HookWrapper />);
    // Verify the text is rendered as expected
    expect(screen.getByText(/Not Authenticated/i)).toBeInTheDocument();
  });

  it('should show "Authenticated" when a token is present', async () => {
    // Set a token in localStorage
    localStorage.setItem('authToken', 'dummy-token');
    render(<HookWrapper />);
    // Wait for the hook effect to update the state
    await waitFor(() => {
      expect(screen.getByText(/Authenticated/i)).toBeInTheDocument();
    });
  });
});

