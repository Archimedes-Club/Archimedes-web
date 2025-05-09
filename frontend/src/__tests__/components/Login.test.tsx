import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from '../../components/Login';
import { login } from '../../services/api/authServices';
import { useAppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

// Mock the dependencies
jest.mock('../../services/api/authServices', () => ({
  login: jest.fn()
}));

jest.mock('../../context/AppContext', () => ({
  useAppContext: jest.fn()
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  Link: ({ children, to }: { children: React.ReactNode, to: string }) => <a href={to}>{children}</a>
}));

describe('Login Component', () => {
  // Set up common mocks and variables before each test
  const mockNavigate = jest.fn();
  const mockSetUser = jest.fn();
  const mockContextValue = {
    user: null,
    setUser: mockSetUser
  };
  
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Set up mocks with default implementations
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useAppContext as jest.Mock).mockReturnValue(mockContextValue);
    
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn()
      },
      writable: true
    });
    
    // Mock window.alert
    window.alert = jest.fn();
  });

  // Helper function to get input elements consistently
  const getFormElements = () => {
    const inputs = screen.getAllByDisplayValue('');
    const emailInput = inputs.find(input => input.getAttribute('type') === 'email');
    const passwordInput = inputs.find(input => input.getAttribute('type') === 'password');
    const loginButton = screen.getByRole('button', { name: /login/i });
    
    if (!emailInput || !passwordInput) {
      throw new Error('Could not find email or password input');
    }
    
    return { emailInput, passwordInput, loginButton };
  };

  /**
   * Test that the login component renders correctly with all necessary elements
   */
  it('renders login form with all inputs and button', () => {
    render(<Login />);
    
    const { emailInput, passwordInput, loginButton } = getFormElements();
    
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
    expect(screen.getByText(/don't have an account/i)).toBeInTheDocument();
    expect(screen.getByText(/register here/i)).toBeInTheDocument();
  });

  /**
   * Test form validation - empty fields should trigger alert
   */
  it('shows alert when form is submitted with empty fields', async () => {
    render(<Login />);
    
    const { loginButton } = getFormElements();
    
    // Submit the form without entering values
    await act(async () => {
      fireEvent.click(loginButton);
    });
    
    // Check that alert was called for empty fields
    expect(window.alert).toHaveBeenCalledWith('Please enter email and password');
    
    // The login function is called with empty strings based on component implementation
    expect(login).toHaveBeenCalledWith('', '');
  });

  /**
   * Test successful login - should update context, set localStorage, and navigate
   */
  it('handles successful login correctly', async () => {
    // Mock successful login response
    const mockUser = {
      id: '123',
      name: 'Test User',
      email: 'test@example.com',
      role: 'student',
      linkedInURL: 'https://linkedin.com/in/testuser',
      phone: '1234567890'
    };
    
    (login as jest.Mock).mockResolvedValueOnce({ 
      user: mockUser
    });
    
    render(<Login />);
    
    const { emailInput, passwordInput, loginButton } = getFormElements();
    
    // Fill in the form
    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
    });
    
    // Submit the form
    await act(async () => {
      fireEvent.click(loginButton);
    });
    
    // Wait for async operations to complete
    await waitFor(() => {
      // Check login was called with correct parameters
      expect(login).toHaveBeenCalledWith('test@example.com', 'password123');
      
      // Check localStorage was updated
      expect(localStorage.setItem).toHaveBeenCalledWith('userRole', 'student');
      expect(localStorage.setItem).toHaveBeenCalledWith('userName', 'Test User');
      expect(localStorage.setItem).toHaveBeenCalledWith('user_id', '123');
      
      // Check context was updated
      expect(mockSetUser).toHaveBeenCalledWith({
        id: '123',
        name: 'Test User',
        email: 'test@example.com',
        linkedInURL: 'https://linkedin.com/in/testuser',
        phone: '1234567890',
        role: 'student'
      });
      
      // Check user was notified
      expect(window.alert).toHaveBeenCalledWith('Logged in as Test User');
      
      // Check navigation occurred
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  /**
   * Test login failure - should show error message
   */
  it('handles login failure correctly', async () => {
    // Mock failed login
    (login as jest.Mock).mockRejectedValueOnce(new Error('Invalid credentials'));
    
    render(<Login />);
    
    const { emailInput, passwordInput, loginButton } = getFormElements();
    
    // Fill in the form
    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    });
    
    // Submit the form
    await act(async () => {
      fireEvent.click(loginButton);
    });
    
    // Wait for async operations to complete
    await waitFor(() => {
      // Check alert was shown
      expect(window.alert).toHaveBeenCalledWith('Invalid Email or Password');
      
      // Verify localStorage and navigation were not called for user data
      expect(localStorage.setItem).not.toHaveBeenCalledWith('userName', expect.any(String));
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  /**
   * Test that form values update correctly when typing
   */
  it('updates form values when typing', async () => {
    render(<Login />);
    
    const { emailInput, passwordInput } = getFormElements();
    
    // Type in email field
    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
    });
    expect(emailInput).toHaveValue('user@example.com');
    
    // Type in password field
    await act(async () => {
      fireEvent.change(passwordInput, { target: { value: 'securepassword' } });
    });
    expect(passwordInput).toHaveValue('securepassword');
  });

  /**
   * Test that the register link points to the correct path
   */
  it('has working register link', () => {
    render(<Login />);
    
    const registerLink = screen.getByText(/register here/i);
    expect(registerLink).toHaveAttribute('href', '/register');
  });
});