import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserProfile from '../../components/UserProfile';
import { useAuth } from '../../hooks/useAuth';

// Mock the useAuth hook
jest.mock('../../hooks/useAuth', () => ({
  useAuth: jest.fn()
}));

// Mock the Sidebar components
jest.mock('../../components/Sidebar', () => ({
  __esModule: true,
  default: ({ isVisible, onClose }) => (
    <div data-testid="sidebar" className={isVisible ? 'visible' : ''}>
      {isVisible && (
        <button onClick={onClose} data-testid="close-sidebar">
          Close
        </button>
      )}
    </div>
  ),
  HamburgerToggle: ({ toggleSidebar }) => (
    <button data-testid="hamburger-toggle" onClick={toggleSidebar}>
      Toggle Menu
    </button>
  )
}));

describe('UserProfile Component', () => {
  // Mock console.log to prevent test output clutter
  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays loading state when loading is true', () => {
    // Mock the useAuth hook to return loading state
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      loading: true,
      userData: null
    });

    render(<UserProfile />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('displays not authenticated message when user is not authenticated', () => {
    // Mock the useAuth hook to return not authenticated state
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      loading: false,
      userData: null
    });

    render(<UserProfile />);
    
    expect(screen.getByText('You are not authenticated. Please log in.')).toBeInTheDocument();
  });

  it('displays user profile information when authenticated', () => {
    // Mock user data
    const mockUserData = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '123-456-7890',
      linkedin_url: 'https://linkedin.com/in/johndoe'
    };

    // Mock the useAuth hook to return authenticated state with user data
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      loading: false,
      userData: mockUserData
    });

    render(<UserProfile />);
    
    // Check if user profile is displayed
    expect(screen.getByText('User Profile')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('123-456-7890')).toBeInTheDocument();
    expect(screen.getByText('https://linkedin.com/in/johndoe')).toBeInTheDocument();
  });

  it('handles missing optional user data gracefully', () => {
    // Mock user data with missing phone and LinkedIn
    const mockUserData = {
      name: 'Jane Smith',
      email: 'jane@example.com'
      // phone and linkedin_url are missing
    };

    // Mock the useAuth hook
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      loading: false,
      userData: mockUserData
    });

    render(<UserProfile />);
    
    // Check if default values are displayed for missing data
    // Use getAllByText since both phone and LinkedIn will show "Not Provided"
    const notProvidedElements = screen.getAllByText('Not Provided');
    expect(notProvidedElements.length).toBe(2);
  });

  it('toggles sidebar visibility when hamburger icon is clicked', () => {
    // Mock the useAuth hook
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      loading: false,
      userData: { name: 'Test User', email: 'test@example.com' }
    });

    render(<UserProfile />);
    
    // Initially, sidebar should not have 'visible' class
    const sidebar = screen.getByTestId('sidebar');
    expect(sidebar).not.toHaveClass('visible');
    
    // Click the hamburger toggle
    fireEvent.click(screen.getByTestId('hamburger-toggle'));
    
    // Now the sidebar should be toggled to visible
    // Note: In our mock, we're setting the class directly based on the isVisible prop
    expect(sidebar).toHaveClass('visible');
    
    // Click the close button
    fireEvent.click(screen.getByTestId('close-sidebar'));
    
    // Sidebar should be hidden again
    expect(sidebar).not.toHaveClass('visible');
  });

  it('allows editing phone number', () => {
    // Mock user data
    const mockUserData = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '123-456-7890',
      linkedin_url: 'https://linkedin.com/in/johndoe'
    };

    // Mock the useAuth hook
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      loading: false,
      userData: mockUserData
    });

    render(<UserProfile />);
    
    // Find and click the Edit button for phone
    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[0]); // First Edit button is for phone
    
    // Now there should be an input field for phone
    const phoneInput = screen.getByDisplayValue('123-456-7890');
    expect(phoneInput).toBeInTheDocument();
    
    // Change the phone number
    fireEvent.change(phoneInput, { target: { value: '987-654-3210' } });
    expect(phoneInput).toHaveValue('987-654-3210');
    
    // Click Update button
    const updateButton = screen.getByText('Update');
    fireEvent.click(updateButton);
    
    // After update, the input should be replaced with text
    expect(screen.queryByDisplayValue('987-654-3210')).not.toBeInTheDocument();
    expect(screen.getByText('987-654-3210')).toBeInTheDocument();
  });

  it('allows editing LinkedIn URL', () => {
    // Mock user data
    const mockUserData = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '123-456-7890',
      linkedin_url: 'https://linkedin.com/in/johndoe'
    };

    // Mock the useAuth hook
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      loading: false,
      userData: mockUserData
    });

    render(<UserProfile />);
    
    // Find and click the Edit button for LinkedIn
    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[1]); // Second Edit button is for LinkedIn
    
    // Now there should be an input field for LinkedIn
    const linkedinInput = screen.getByDisplayValue('https://linkedin.com/in/johndoe');
    expect(linkedinInput).toBeInTheDocument();
    
    // Change the LinkedIn URL
    fireEvent.change(linkedinInput, { target: { value: 'https://linkedin.com/in/johndoe-updated' } });
    expect(linkedinInput).toHaveValue('https://linkedin.com/in/johndoe-updated');
    
    // Click Update button
    const updateButtons = screen.getAllByText('Update');
    fireEvent.click(updateButtons[0]); // Assuming there's only one Update button visible
    
    // After update, the input should be replaced with text
    expect(screen.queryByDisplayValue('https://linkedin.com/in/johndoe-updated')).not.toBeInTheDocument();
    expect(screen.getByText('https://linkedin.com/in/johndoe-updated')).toBeInTheDocument();
  });

  it('handles editing when fields are initially empty', () => {
    // Mock user data with empty optional fields
    const mockUserData = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '',
      linkedin_url: ''
    };

    // Mock the useAuth hook
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      loading: false,
      userData: mockUserData
    });

    render(<UserProfile />);
    
    // Find and click the Edit button for phone
    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[0]); // First Edit button is for phone
    
    // Now there should be an empty input field for phone
    const phoneInput = screen.getByDisplayValue('');
    expect(phoneInput).toBeInTheDocument();
    
    // Add a phone number
    fireEvent.change(phoneInput, { target: { value: '555-123-4567' } });
    expect(phoneInput).toHaveValue('555-123-4567');
    
    // Click Update button
    const updateButton = screen.getByText('Update');
    fireEvent.click(updateButton);
    
    // After update, the phone number should be displayed
    expect(screen.getByText('555-123-4567')).toBeInTheDocument();
    
    // There should still be one "Not Provided" for LinkedIn
    const notProvidedElements = screen.getAllByText('Not Provided');
    expect(notProvidedElements.length).toBe(1);
  });
});