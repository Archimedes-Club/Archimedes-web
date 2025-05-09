import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dashboard from '../../components/Dashboard';

// Mock all external dependencies first
jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn()
}));

jest.mock('@mui/material/useMediaQuery', () => () => false);

jest.mock('../../services/api/projectServices', () => ({
  getProjects: jest.fn(),
  createProject: jest.fn(),
  putProject: jest.fn()
}));

jest.mock('../../services/api/authServices', () => ({
  getUser: jest.fn()
}));

jest.mock('../../services/api/projectMembershipServices', () => ({
  joinProjectRequest: jest.fn()
}));

// Mock child components
jest.mock('../../components/Sidebar', () => ({
  __esModule: true,
  default: () => <div data-testid="sidebar" />,
  HamburgerToggle: () => <button data-testid="hamburger-toggle">Toggle</button>
}));

jest.mock('../../components/ProjectTable', () => ({
  __esModule: true,
  default: ({ projects, onJoinRequest }) => (
    <div data-testid="project-table">
      {projects.map((project) => (
        <div key={project.id}>
          {project.title}
          <button 
            onClick={() => onJoinRequest(project.id)} 
            data-testid={`join-button-${project.id}`}
          >
            Join
          </button>
        </div>
      ))}
    </div>
  )
}));

jest.mock('../../components/ProjectForm', () => ({
  __esModule: true,
  default: ({ mode, onSubmit, onCancel }) => (
    <div data-testid="project-form">
      <span>Mode: {mode}</span>
      <button 
        onClick={() => onSubmit({ id: 999, title: 'New Project', description: 'Test', status: 'Active', category: 'Web', team_lead: 'Test User', team_size: 3 })}
        data-testid="submit-form"
      >
        Submit
      </button>
      <button onClick={onCancel} data-testid="cancel-form">
        Cancel
      </button>
    </div>
  )
}));

jest.mock('../../components/NotificationService', () => ({
  NotificationComponent: () => <div data-testid="notifications" />
}));

// Now import the mocked modules
import { getProjects, createProject, putProject } from '../../services/api/projectServices';
import { getUser } from '../../services/api/authServices';
import { joinProjectRequest } from '../../services/api/projectMembershipServices';

describe('Dashboard Component', () => {
  // Mock data
  const mockProjects = [
    { 
      id: 1, 
      title: 'Project 1', 
      description: 'Description 1',
      status: 'Ongoing',
      category: 'Web',
      team_lead: 'John Doe',
      team_size: 3
    },
    { 
      id: 2, 
      title: 'Project 2', 
      description: 'Description 2',
      status: 'Completed',
      category: 'Mobile',
      team_lead: 'Jane Smith',
      team_size: 5
    }
  ];

  // Professor user data
  const mockProfessorUser = {
    id: 123,
    name: 'John Doe',
    role: 'professor',
    email: 'john@example.com'
  };

  // Student user data
  const mockStudentUser = {
    id: 456,
    name: 'Jane Student',
    role: 'student',
    email: 'jane@example.com'
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock implementations
    (getProjects as jest.Mock).mockResolvedValue({
      data: mockProjects
    });
    
    (getUser as jest.Mock).mockResolvedValue({
      data: mockProfessorUser
    });
    
    (createProject as jest.Mock).mockResolvedValue({
      data: {
        data: { 
          id: 3, 
          title: 'New Project', 
          description: 'Test',
          status: 'Active',
          category: 'Web',
          team_lead: 'Test User',
          team_size: 3
        }
      }
    });
    
    (putProject as jest.Mock).mockResolvedValue({
      data: {
        data: { 
          id: 1, 
          title: 'Updated Project', 
          description: 'Updated description',
          status: 'Active',
          category: 'Web',
          team_lead: 'John Doe',
          team_size: 4
        }
      }
    });
    
    (joinProjectRequest as jest.Mock).mockResolvedValue({
      data: { 
        message: 'Join request sent successfully' 
      }
    });

    // Silence console logs
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
    
    // Mock alert
    window.alert = jest.fn();
  });

  it('should render loading state initially', () => {
    render(<Dashboard />);
    expect(screen.getByText('Loading projects...')).toBeInTheDocument();
  });

  it('should display projects after loading', async () => {
    render(<Dashboard />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading projects...')).not.toBeInTheDocument();
    });
    
    // Check if projects are displayed
    expect(screen.getByText('Project 1')).toBeInTheDocument();
    expect(screen.getByText('Project 2')).toBeInTheDocument();
  });

  it('should display welcome message with appropriate title based on user role (professor)', async () => {
    render(<Dashboard />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading projects...')).not.toBeInTheDocument();
    });
    
    // Check welcome message for professor
    expect(screen.getByText('Welcome Prof. John Doe')).toBeInTheDocument();
  });

  it('should display welcome message without title for student role', async () => {
    // Override the default mock to return student user
    (getUser as jest.Mock).mockResolvedValue({
      data: mockStudentUser
    });
    
    render(<Dashboard />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading projects...')).not.toBeInTheDocument();
    });
    
    // Check welcome message for student
    expect(screen.getByText('Welcome Jane Student')).toBeInTheDocument();
  });

  it('should show Create Project button for professor role', async () => {
    render(<Dashboard />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading projects...')).not.toBeInTheDocument();
    });
    
    // Check if Create Project button is visible for professor
    expect(screen.getByText('Create a Project')).toBeInTheDocument();
  });

  it('should not show Create Project button for student role', async () => {
    // Override the default mock to return student user
    (getUser as jest.Mock).mockResolvedValue({
      data: mockStudentUser
    });
    
    render(<Dashboard />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading projects...')).not.toBeInTheDocument();
    });
    
    // Check if Create Project button is not visible for student
    expect(screen.queryByText('Create a Project')).not.toBeInTheDocument();
  });

  it('should open project form when Create Project button is clicked', async () => {
    render(<Dashboard />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading projects...')).not.toBeInTheDocument();
    });
    
    // Click Create Project button
    fireEvent.click(screen.getByText('Create a Project'));
    
    // Check if project form is shown
    expect(screen.getByTestId('project-form')).toBeInTheDocument();
    expect(screen.getByText('Mode: create')).toBeInTheDocument();
  });

  it('should close project form when cancel is clicked', async () => {
    render(<Dashboard />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading projects...')).not.toBeInTheDocument();
    });
    
    // Click Create Project button
    fireEvent.click(screen.getByText('Create a Project'));
    
    // Check if project form is shown
    expect(screen.getByTestId('project-form')).toBeInTheDocument();
    
    // Click cancel button
    fireEvent.click(screen.getByTestId('cancel-form'));
    
    // Check if we're back to the project list
    await waitFor(() => {
      expect(screen.queryByTestId('project-form')).not.toBeInTheDocument();
      expect(screen.getByTestId('project-table')).toBeInTheDocument();
    });
  });

  it('should handle project creation', async () => {
    render(<Dashboard />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading projects...')).not.toBeInTheDocument();
    });
    
    // Click Create Project button
    fireEvent.click(screen.getByText('Create a Project'));
    
    // Submit the form
    fireEvent.click(screen.getByTestId('submit-form'));
    
    // Check if createProject API was called
    await waitFor(() => {
      expect(createProject).toHaveBeenCalled();
    });
    
    // Check if we're back to the project list
    await waitFor(() => {
      expect(screen.queryByTestId('project-form')).not.toBeInTheDocument();
      expect(screen.getByTestId('project-table')).toBeInTheDocument();
    });
  });

  it('should handle join request', async () => {
    render(<Dashboard />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading projects...')).not.toBeInTheDocument();
    });
    
    // Click join button for first project
    fireEvent.click(screen.getByTestId('join-button-1'));
    
    // Check if joinProjectRequest API was called with correct project ID
    expect(joinProjectRequest).toHaveBeenCalledWith([1]);
    
    // Check if alert was shown
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalled();
    });
  });
});