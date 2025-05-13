import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AppProvider, useAppContext } from '../../context/AppContext';
import { User } from '../../types/user.types';
import { Project } from '../../types/projects.types';

// Create test components to test the context
const TestConsumer = () => {
  const { 
    user, 
    setUser, 
    projects, 
    addProject, 
    updateProject, 
    deleteProject 
  } = useAppContext();

  const handleLogin = () => {
    const testUser: User = {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      role: 'professor'
    };
    setUser(testUser);
  };

  const handleAddProject = () => {
    const testProject: Project = {
      id: 1,
      title: 'Test Project',
      description: 'A test project',
      status: 'Active',
      category: 'Test',
      team_lead: 'Test User',
      team_size: 3
    };
    addProject(testProject);
  };

  const handleUpdateProject = () => {
    const updatedProject: Project = {
      id: 1,
      title: 'Updated Project',
      description: 'An updated test project',
      status: 'Completed',
      category: 'Test',
      team_lead: 'Test User',
      team_size: 5
    };
    updateProject(updatedProject);
  };

  const handleDeleteProject = () => {
    deleteProject(1);
  };

  return (
    <div>
      <div data-testid="user-info">
        {user ? `${user.name} (${user.email})` : 'No user'}
      </div>
      
      <div data-testid="projects-count">
        {projects.length} projects
      </div>
      
      <div data-testid="project-details">
        {projects.map(p => (
          <div key={p.id}>{p.title}: {p.status}</div>
        ))}
      </div>
      
      <button onClick={handleLogin} data-testid="login-button">
        Login
      </button>
      
      <button onClick={handleAddProject} data-testid="add-project-button">
        Add Project
      </button>
      
      <button onClick={handleUpdateProject} data-testid="update-project-button">
        Update Project
      </button>
      
      <button onClick={handleDeleteProject} data-testid="delete-project-button">
        Delete Project
      </button>
    </div>
  );
};

// Create a component that throws an error when used outside provider
const OutsideConsumer = () => {
  const context = useAppContext();
  return <div>{context.user ? 'User exists' : 'No user'}</div>;
};

describe('AppContext', () => {
  it('initializes with null user and empty projects array', () => {
    render(
      <AppProvider>
        <TestConsumer />
      </AppProvider>
    );
    
    expect(screen.getByTestId('user-info')).toHaveTextContent('No user');
    expect(screen.getByTestId('projects-count')).toHaveTextContent('0 projects');
  });
  
  it('sets the user correctly', () => {
    render(
      <AppProvider>
        <TestConsumer />
      </AppProvider>
    );
    
    act(() => {
      fireEvent.click(screen.getByTestId('login-button'));
    });
    
    expect(screen.getByTestId('user-info')).toHaveTextContent('Test User (test@example.com)');
  });
  
  it('adds a project correctly', () => {
    render(
      <AppProvider>
        <TestConsumer />
      </AppProvider>
    );
    
    act(() => {
      fireEvent.click(screen.getByTestId('add-project-button'));
    });
    
    expect(screen.getByTestId('projects-count')).toHaveTextContent('1 projects');
    expect(screen.getByTestId('project-details')).toHaveTextContent('Test Project: Active');
  });
  
  it('updates a project correctly', () => {
    render(
      <AppProvider>
        <TestConsumer />
      </AppProvider>
    );
    
    // First add a project
    act(() => {
      fireEvent.click(screen.getByTestId('add-project-button'));
    });
    
    // Then update it
    act(() => {
      fireEvent.click(screen.getByTestId('update-project-button'));
    });
    
    expect(screen.getByTestId('project-details')).toHaveTextContent('Updated Project: Completed');
  });
  
  it('deletes a project correctly', () => {
    render(
      <AppProvider>
        <TestConsumer />
      </AppProvider>
    );
    
    // First add a project
    act(() => {
      fireEvent.click(screen.getByTestId('add-project-button'));
    });
    
    // Make sure it's added
    expect(screen.getByTestId('projects-count')).toHaveTextContent('1 projects');
    
    // Then delete it
    act(() => {
      fireEvent.click(screen.getByTestId('delete-project-button'));
    });
    
    expect(screen.getByTestId('projects-count')).toHaveTextContent('0 projects');
    expect(screen.getByTestId('project-details')).toBeEmptyDOMElement();
  });
  
  it('throws error when used outside of provider', () => {
    // Mock console.error to prevent error output in test
    const originalConsoleError = console.error;
    console.error = jest.fn();
    
    // Define a test render function that should throw
    const renderOutsideProvider = () => {
      render(<OutsideConsumer />);
    };
    
    // Expect the render to throw
    expect(renderOutsideProvider).toThrow('useAppContext must be used within AppProvider');
    
    // Restore console.error
    console.error = originalConsoleError;
  });
  
  it('shares the same context across multiple components', () => {
    // Create another test component
    const AnotherConsumer = () => {
      const { user } = useAppContext();
      return <div data-testid="another-user">{user ? user.name : 'No user'}</div>;
    };
    
    render(
      <AppProvider>
        <div>
          <TestConsumer />
          <AnotherConsumer />
        </div>
      </AppProvider>
    );
    
    // Initially both show no user
    expect(screen.getByTestId('user-info')).toHaveTextContent('No user');
    expect(screen.getByTestId('another-user')).toHaveTextContent('No user');
    
    // Update the user via TestConsumer
    act(() => {
      fireEvent.click(screen.getByTestId('login-button'));
    });
    
    // Both components should now show the user
    expect(screen.getByTestId('user-info')).toHaveTextContent('Test User');
    expect(screen.getByTestId('another-user')).toHaveTextContent('Test User');
  });
});