import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Registration from '../../components/Registration';
import { registerUser, login } from '../../services/api/authServices';
import { useNavigate } from 'react-router-dom';

// Mock the dependencies
jest.mock('../../services/api/authServices', () => ({
  registerUser: jest.fn(),
  login: jest.fn()
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  Link: ({ children, to }: { children: React.ReactNode, to: string }) => <a href={to}>{children}</a>
}));

describe('Registration Component', () => {
  const mockNavigate = jest.fn();
  
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Set up navigation mock
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    
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
    
    // Mock console.error to prevent cluttering test output
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  // Helper function to get form fields by name attribute
  const getFormFields = () => {
    // Use getAllByRole first to get all inputs, then filter by name attribute
    const textboxInputs = screen.getAllByRole('textbox');
    const passwordInputs = Array.from(document.querySelectorAll('input[type="password"]'));
    const telInputs = Array.from(document.querySelectorAll('input[type="tel"]'));
    const urlInputs = Array.from(document.querySelectorAll('input[type="url"]'));
    
    const allInputs = [...textboxInputs, ...passwordInputs, ...telInputs, ...urlInputs];
    
    const nameInput = allInputs.find(input => input.getAttribute('name') === 'name');
    const emailInput = allInputs.find(input => input.getAttribute('name') === 'email');
    const passwordInput = allInputs.find(input => input.getAttribute('name') === 'password');
    const confirmPasswordInput = allInputs.find(input => input.getAttribute('name') === 'password_confirmation');
    const phoneInput = allInputs.find(input => input.getAttribute('name') === 'phone');
    const linkedInInput = allInputs.find(input => input.getAttribute('name') === 'linkedin_url');
    const registerButton = screen.getByRole('button', { name: /register/i });
    
    if (!nameInput || !emailInput || !passwordInput || !confirmPasswordInput || !phoneInput || !linkedInInput) {
      throw new Error('Could not find one or more form inputs');
    }
    
    return {
      nameInput,
      emailInput,
      passwordInput,
      confirmPasswordInput,
      phoneInput,
      linkedInInput,
      registerButton
    };
  };

  // Helper function to fill the form
  const fillForm = async (overrides = {}) => {
    const defaultValues = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      passwordConfirmation: 'password123',
      phone: '1234567890',
      linkedIn: 'https://linkedin.com/in/johndoe'
    };

    const values = { ...defaultValues, ...overrides };
    
    const { 
      nameInput, 
      emailInput, 
      passwordInput, 
      confirmPasswordInput,
      phoneInput,
      linkedInInput
    } = getFormFields();

    await act(async () => {
      fireEvent.change(nameInput, { target: { value: values.name } });
      fireEvent.change(emailInput, { target: { value: values.email } });
      fireEvent.change(passwordInput, { target: { value: values.password } });
      fireEvent.change(confirmPasswordInput, { target: { value: values.passwordConfirmation } });
      fireEvent.change(phoneInput, { target: { value: values.phone } });
      fireEvent.change(linkedInInput, { target: { value: values.linkedIn } });
    });
  };

  /**
   * Test that the registration component renders correctly with all necessary elements
   */
  it('renders registration form with all inputs and button', () => {
    render(<Registration />);
    
    // Get inputs by their type attributes
    const textInputs = screen.getAllByRole('textbox');
    const passwordInputs = Array.from(document.querySelectorAll('input[type="password"]'));
    const submitButton = screen.getByRole('button', { name: /register/i });
    
    // Check that the form has the right number of inputs
    expect(textInputs.length).toBeGreaterThanOrEqual(3); // Name, Email, LinkedIn (possibly more)
    expect(passwordInputs.length).toBe(2); // Password and Confirm Password
    expect(submitButton).toBeInTheDocument();
    expect(screen.getByText(/already have an account/i)).toBeInTheDocument();
    expect(screen.getByText(/login here/i)).toBeInTheDocument();
  });

  /**
   * Test form input changes
   */
  it('updates form values when typing', async () => {
    render(<Registration />);
    
    // Fill the form
    await fillForm();
    
    const { 
      nameInput, 
      emailInput, 
      passwordInput, 
      confirmPasswordInput,
      phoneInput,
      linkedInInput
    } = getFormFields();
    
    // Check that the input values have been updated
    expect(nameInput).toHaveValue('John Doe');
    expect(emailInput).toHaveValue('john@example.com');
    expect(passwordInput).toHaveValue('password123');
    expect(confirmPasswordInput).toHaveValue('password123');
    expect(phoneInput).toHaveValue('1234567890');
    expect(linkedInInput).toHaveValue('https://linkedin.com/in/johndoe');
  });

  /**
   * Test form validation - required fields
   */
  it('validates required fields', async () => {
    render(<Registration />);
    
    const { registerButton } = getFormFields();
    
    // Submit the form without filling any fields
    await act(async () => {
      fireEvent.click(registerButton);
    });
    
    // Check for validation error messages
    expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    
    // Use getAllByText for password messages since there might be multiple matches
    const passwordErrors = screen.getAllByText(/password is required/i);
    expect(passwordErrors.length).toBeGreaterThanOrEqual(1);
    
    // Check specifically for confirm password error
    const confirmErrors = screen.getAllByText(/confirm password is required/i);
    expect(confirmErrors.length).toBe(1);
    
    // registerUser should not be called
    expect(registerUser).not.toHaveBeenCalled();
  });

  /**
   * Test form validation - email format
   */
  it('validates email format', async () => {
    render(<Registration />);
    
    const { registerButton } = getFormFields();
    
    // Fill form with invalid email
    await fillForm({ email: 'invalid-email' });
    
    // Submit the form
    await act(async () => {
      fireEvent.click(registerButton);
    });
    
    // Check for email validation error
    expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
    
    // registerUser should not be called
    expect(registerUser).not.toHaveBeenCalled();
  });

  /**
   * Test form validation - password match
   */
  it('validates password match', async () => {
    render(<Registration />);
    
    const { registerButton } = getFormFields();
    
    // Fill form with mismatched passwords
    await fillForm({ 
      password: 'password123', 
      passwordConfirmation: 'differentpassword' 
    });
    
    // Submit the form
    await act(async () => {
      fireEvent.click(registerButton);
    });
    
    // Check for password match error
    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    
    // registerUser should not be called
    expect(registerUser).not.toHaveBeenCalled();
  });

  /**
   * Test form validation - LinkedIn URL format
   */
  it('validates LinkedIn URL format', async () => {
    render(<Registration />);
    
    const { registerButton } = getFormFields();
    
    // Fill form with invalid LinkedIn URL
    await fillForm({ linkedIn: 'https://example.com/johndoe' });
    
    // Submit the form
    await act(async () => {
      fireEvent.click(registerButton);
    });
    
    // Check for LinkedIn URL validation error
    expect(screen.getByText(/please enter a valid linkedin url/i)).toBeInTheDocument();
    
    // registerUser should not be called
    expect(registerUser).not.toHaveBeenCalled();
  });

  /**
   * Test successful registration
   */
  it('handles successful registration', async () => {
    // Mock successful registration response
    const mockResponseData = {
      id: '123',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'student',
      phone: '1234567890',
      linkedin_url: 'https://linkedin.com/in/johndoe'
    };
    
    (registerUser as jest.Mock).mockResolvedValueOnce({ 
      data: mockResponseData 
    });
    
    (login as jest.Mock).mockResolvedValueOnce({});
    
    render(<Registration />);
    
    const { registerButton } = getFormFields();
    
    // Fill the form
    await fillForm();
    
    // Submit the form
    await act(async () => {
      fireEvent.click(registerButton);
    });
    
    // Wait for async operations to complete
    await waitFor(() => {
      // Check registerUser was called with correct data
      expect(registerUser).toHaveBeenCalledWith(JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        password_confirmation: 'password123',
        phone: '1234567890',
        linkedin_url: 'https://linkedin.com/in/johndoe'
      }));
      
      // Check login was called
      expect(login).toHaveBeenCalledWith('john@example.com', 'password123');
      
      // Check localStorage was updated
      expect(localStorage.setItem).toHaveBeenCalledWith('userRole', 'student');
      expect(localStorage.setItem).toHaveBeenCalledWith('userName', 'John Doe');
      expect(localStorage.setItem).toHaveBeenCalledWith('userPhone', '1234567890');
      expect(localStorage.setItem).toHaveBeenCalledWith('userLinkedin', 'https://linkedin.com/in/johndoe');
      
      // Check alert was shown
      expect(window.alert).toHaveBeenCalledWith('Registration successful!');
      
      // Check navigation
      expect(mockNavigate).toHaveBeenCalledWith('/verify-email');
    });
  });

  /**
   * Test failed registration
   */
  it('handles registration failure', async () => {
    // Mock failed registration
    const mockError = new Error('Registration failed');
    (registerUser as jest.Mock).mockRejectedValueOnce(mockError);
    
    render(<Registration />);
    
    const { registerButton } = getFormFields();
    
    // Fill the form
    await fillForm();
    
    // Submit the form
    await act(async () => {
      fireEvent.click(registerButton);
    });
    
    // Wait for async operations to complete
    await waitFor(() => {
      // Check error was logged and alerted
      expect(console.error).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith(mockError);
      
      // Check login was not called
      expect(login).not.toHaveBeenCalled();
      
      // Check navigation did not occur
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  /**
   * Test that the login link points to the correct path
   */
  it('has working login link', () => {
    render(<Registration />);
    
    const loginLink = screen.getByText(/login here/i);
    expect(loginLink).toHaveAttribute('href', '/login');
  });
});