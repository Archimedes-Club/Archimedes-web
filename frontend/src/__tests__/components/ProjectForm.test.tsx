import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProjectForm from '../../components/ProjectForm';
import { ProjectExtended } from '../../types/extendedProject.types';

// Mock the alert function
window.alert = jest.fn();

describe('ProjectForm Component', () => {
  // Default props for most tests
  const defaultProps = {
    mode: 'create' as const,
    onSubmit: jest.fn(),
    onCancel: jest.fn(),
    isSubmitting: false,
    userName: 'Test User'
  };

  // Sample project data for edit mode tests
  const sampleProject: ProjectExtended = {
    id: 123,
    title: 'Test Project',
    description: 'This is a test project',
    status: 'Ongoing',
    category: 'Web',
    team_lead: 'Test User',
    team_size: 3
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Helper function to fill out the form
  const fillForm = (formData = {}) => {
    const defaultFormData = {
      title: 'New Project',
      description: 'Project Description',
      status: 'Ongoing',
      category: 'Web',
      team_lead: 'Project Lead',
      team_size: '5'
    };

    const data = { ...defaultFormData, ...formData };

    fireEvent.change(screen.getByLabelText(/project title/i), {
      target: { value: data.title }
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: data.description }
    });
    fireEvent.change(screen.getByLabelText(/team size/i), {
      target: { value: data.team_size }
    });
    fireEvent.change(screen.getByLabelText(/status/i), {
      target: { value: data.status }
    });
    fireEvent.change(screen.getByLabelText(/category/i), {
      target: { value: data.category }
    });
    fireEvent.change(screen.getByLabelText(/team lead/i), {
      target: { value: data.team_lead }
    });
  };

  it('renders form correctly in create mode', () => {
    render(<ProjectForm {...defaultProps} />);
    
    // Check form fields are rendered
    expect(screen.getByLabelText(/project title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/team size/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/team lead/i)).toBeInTheDocument();
    
    // Check create mode button text
    expect(screen.getByRole('button', { name: /create project/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    
    // Check initial values
    expect(screen.getByLabelText(/team lead/i)).toHaveValue('Test User');
    expect(screen.getByLabelText(/team size/i)).toHaveValue(1);
  });

  it('renders form correctly in edit mode with initialData', () => {
    render(
      <ProjectForm 
        {...defaultProps} 
        mode="edit" 
        initialData={sampleProject} 
      />
    );
    
    // Check form is populated with initialData
    expect(screen.getByLabelText(/project title/i)).toHaveValue('Test Project');
    expect(screen.getByLabelText(/description/i)).toHaveValue('This is a test project');
    expect(screen.getByLabelText(/team size/i)).toHaveValue(3);
    expect(screen.getByLabelText(/status/i)).toHaveValue('Ongoing');
    expect(screen.getByLabelText(/category/i)).toHaveValue('Web');
    expect(screen.getByLabelText(/team lead/i)).toHaveValue('Test User');
    
    // Check edit mode button text
    expect(screen.getByRole('button', { name: /update project/i })).toBeInTheDocument();
  });

  it('updates form state when inputs change', () => {
    render(<ProjectForm {...defaultProps} />);
    
    // Fill out the form
    fillForm();
    
    // Check that values have been updated
    expect(screen.getByLabelText(/project title/i)).toHaveValue('New Project');
    expect(screen.getByLabelText(/description/i)).toHaveValue('Project Description');
    expect(screen.getByLabelText(/team size/i)).toHaveValue(5);
    expect(screen.getByLabelText(/status/i)).toHaveValue('Ongoing');
    expect(screen.getByLabelText(/category/i)).toHaveValue('Web');
    expect(screen.getByLabelText(/team lead/i)).toHaveValue('Project Lead');
  });

  it('calls onSubmit with form data when submitted with valid data', () => {
    render(<ProjectForm {...defaultProps} />);
    
    // Fill out the form
    fillForm();
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /create project/i }));
    
    // Check that onSubmit was called with the correct data
    expect(defaultProps.onSubmit).toHaveBeenCalledWith(expect.objectContaining({
      id: 0, // Default value
      title: 'New Project',
      description: 'Project Description',
      status: 'Ongoing',
      category: 'Web',
      team_lead: 'Project Lead',
      team_size: 5 // Note: converted to number
    }));
  });

  it('shows validation error when required fields are missing', () => {
    render(<ProjectForm {...defaultProps} />);
    
    // Submit form without filling required fields
    fireEvent.click(screen.getByRole('button', { name: /create project/i }));
    
    // Check that alert was shown
    expect(window.alert).toHaveBeenCalledWith('Please fill all required fields.');
    
    // Check that onSubmit was not called
    expect(defaultProps.onSubmit).not.toHaveBeenCalled();
  });

  it('calls onCancel when cancel button is clicked', () => {
    render(<ProjectForm {...defaultProps} />);
    
    // Click cancel button
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    
    // Check that onCancel was called
    expect(defaultProps.onCancel).toHaveBeenCalled();
  });

  it('disables form inputs and buttons when isSubmitting is true', () => {
    render(<ProjectForm {...defaultProps} isSubmitting={true} />);
    
    // Check that all form fields are disabled
    expect(screen.getByLabelText(/project title/i)).toBeDisabled();
    expect(screen.getByLabelText(/description/i)).toBeDisabled();
    expect(screen.getByLabelText(/team size/i)).toBeDisabled();
    expect(screen.getByLabelText(/status/i)).toBeDisabled();
    expect(screen.getByLabelText(/category/i)).toBeDisabled();
    expect(screen.getByLabelText(/team lead/i)).toBeDisabled();
    
    // Check that buttons are disabled
    expect(screen.getByRole('button', { name: /processing/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeDisabled();
    
    // Check that button text changes
    expect(screen.getByRole('button', { name: /processing/i })).toBeInTheDocument();
  });

  it('handles form validation correctly for each required field', () => {
    render(<ProjectForm {...defaultProps} />);
    
    // Test each required field individually
    
    // 1. Missing title
    fillForm({ title: '' });
    fireEvent.click(screen.getByRole('button', { name: /create project/i }));
    expect(window.alert).toHaveBeenCalledWith('Please fill all required fields.');
    expect(defaultProps.onSubmit).not.toHaveBeenCalled();
    jest.clearAllMocks();
    
    // 2. Missing description
    fillForm({ description: '' });
    fireEvent.click(screen.getByRole('button', { name: /create project/i }));
    expect(window.alert).toHaveBeenCalledWith('Please fill all required fields.');
    expect(defaultProps.onSubmit).not.toHaveBeenCalled();
    jest.clearAllMocks();
    
    // 3. Missing status
    fillForm({ status: '' });
    fireEvent.click(screen.getByRole('button', { name: /create project/i }));
    expect(window.alert).toHaveBeenCalledWith('Please fill all required fields.');
    expect(defaultProps.onSubmit).not.toHaveBeenCalled();
    jest.clearAllMocks();
    
    // 4. Missing category
    fillForm({ category: '' });
    fireEvent.click(screen.getByRole('button', { name: /create project/i }));
    expect(window.alert).toHaveBeenCalledWith('Please fill all required fields.');
    expect(defaultProps.onSubmit).not.toHaveBeenCalled();
  });
});