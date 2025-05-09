import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ConfirmDialog } from '../../components/ConfirmDialog';

describe('ConfirmDialog Component', () => {
  // Mock handler functions
  const mockOnClose = jest.fn();
  const mockOnConfirm = jest.fn();
  
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('renders dialog when open is true', () => {
    render(
      <ConfirmDialog
        open={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );
    
    // Dialog should be in the document
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
  
  it('does not render dialog when open is false', () => {
    render(
      <ConfirmDialog
        open={false}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );
    
    // Dialog should not be in the document
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
  
  it('renders with default props correctly', () => {
    render(
      <ConfirmDialog
        open={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );
    
    // Check default props
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to perform this action?')).toBeInTheDocument();
    expect(screen.getByText('Confirm')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });
  
  it('renders with custom props correctly', () => {
    const customTitle = 'Custom Title';
    const customContent = 'Custom content for testing';
    const customConfirmText = 'Yes, do it';
    const customCancelText = 'No, go back';
    
    render(
      <ConfirmDialog
        open={true}
        title={customTitle}
        content={customContent}
        confirmText={customConfirmText}
        cancelText={customCancelText}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );
    
    // Check custom props
    expect(screen.getByText(customTitle)).toBeInTheDocument();
    expect(screen.getByText(customContent)).toBeInTheDocument();
    expect(screen.getByText(customConfirmText)).toBeInTheDocument();
    expect(screen.getByText(customCancelText)).toBeInTheDocument();
  });
  
  it('calls onClose when Cancel button is clicked', () => {
    render(
      <ConfirmDialog
        open={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );
    
    // Click the Cancel button
    fireEvent.click(screen.getByText('Cancel'));
    
    // onClose should be called
    expect(mockOnClose).toHaveBeenCalledTimes(1);
    // onConfirm should not be called
    expect(mockOnConfirm).not.toHaveBeenCalled();
  });
  
  it('calls onConfirm when Confirm button is clicked', () => {
    render(
      <ConfirmDialog
        open={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );
    
    // Click the Confirm button
    fireEvent.click(screen.getByText('Confirm'));
    
    // onConfirm should be called
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    // onClose should not be called
    expect(mockOnClose).not.toHaveBeenCalled();
  });
  
  it('uses custom button text for actions', () => {
    render(
      <ConfirmDialog
        open={true}
        confirmText="Delete"
        cancelText="Keep"
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );
    
    // Check that buttons have custom text
    expect(screen.getByText('Delete')).toBeInTheDocument();
    expect(screen.getByText('Keep')).toBeInTheDocument();
    
    // Verify they work correctly
    fireEvent.click(screen.getByText('Delete'));
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    
    fireEvent.click(screen.getByText('Keep'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});