import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import useFormInput from '../../hooks/useFormInput';

// Test component that uses the useFormInput hook
const TestComponent: React.FC<{ initialState: any }> = ({ initialState }) => {
  const [formState, handleInputChange] = useFormInput(initialState);

  return (
    <div>
      <input
        type="text"
        name="name"
        data-testid="name-input"
        value={formState.name || ''}
        onChange={handleInputChange}
      />
      <input
        type="email"
        name="email"
        data-testid="email-input"
        value={formState.email || ''}
        onChange={handleInputChange}
      />
      <textarea
        name="message"
        data-testid="message-input"
        value={formState.message || ''}
        onChange={handleInputChange}
      />
      <select
        name="option"
        data-testid="select-input"
        value={formState.option || ''}
        onChange={handleInputChange}
      >
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
      </select>
      <div data-testid="form-state">{JSON.stringify(formState)}</div>
    </div>
  );
};

describe('useFormInput Hook', () => {
  it('should initialize with the provided state', () => {
    const initialState = { name: 'John', email: 'john@example.com' };
    render(<TestComponent initialState={initialState} />);

    expect(screen.getByTestId('name-input')).toHaveValue('John');
    expect(screen.getByTestId('email-input')).toHaveValue('john@example.com');
    expect(JSON.parse(screen.getByTestId('form-state').textContent || '{}')).toEqual(initialState);
  });

  it('should update form state when text input changes', () => {
    const initialState = { name: '', email: '' };
    render(<TestComponent initialState={initialState} />);

    const nameInput = screen.getByTestId('name-input');
    fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });

    expect(nameInput).toHaveValue('Jane Doe');
    expect(JSON.parse(screen.getByTestId('form-state').textContent || '{}')).toEqual({
      name: 'Jane Doe',
      email: ''
    });
  });

  it('should update form state when email input changes', () => {
    const initialState = { name: 'Jane', email: '' };
    render(<TestComponent initialState={initialState} />);

    const emailInput = screen.getByTestId('email-input');
    fireEvent.change(emailInput, { target: { value: 'jane@example.com' } });

    expect(emailInput).toHaveValue('jane@example.com');
    expect(JSON.parse(screen.getByTestId('form-state').textContent || '{}')).toEqual({
      name: 'Jane',
      email: 'jane@example.com'
    });
  });

  it('should update form state when textarea changes', () => {
    const initialState = { name: 'Jane', email: 'jane@example.com', message: '' };
    render(<TestComponent initialState={initialState} />);

    const messageInput = screen.getByTestId('message-input');
    fireEvent.change(messageInput, { target: { value: 'Hello world!' } });

    expect(messageInput).toHaveValue('Hello world!');
    expect(JSON.parse(screen.getByTestId('form-state').textContent || '{}')).toEqual({
      name: 'Jane',
      email: 'jane@example.com',
      message: 'Hello world!'
    });
  });

  it('should update form state when select input changes', () => {
    const initialState = { name: 'Jane', option: 'option1' };
    render(<TestComponent initialState={initialState} />);

    const selectInput = screen.getByTestId('select-input');
    fireEvent.change(selectInput, { target: { value: 'option2' } });

    expect(selectInput).toHaveValue('option2');
    expect(JSON.parse(screen.getByTestId('form-state').textContent || '{}')).toEqual({
      name: 'Jane',
      option: 'option2'
    });
  });

  it('should handle multiple input changes', () => {
    const initialState = { name: '', email: '', message: '', option: '' };
    render(<TestComponent initialState={initialState} />);

    // Change name
    fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'John Smith' } });
    
    // Change email
    fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'john@example.com' } });
    
    // Change message
    fireEvent.change(screen.getByTestId('message-input'), { target: { value: 'Test message' } });
    
    // Change select
    fireEvent.change(screen.getByTestId('select-input'), { target: { value: 'option2' } });

    // Verify all values updated correctly
    expect(screen.getByTestId('name-input')).toHaveValue('John Smith');
    expect(screen.getByTestId('email-input')).toHaveValue('john@example.com');
    expect(screen.getByTestId('message-input')).toHaveValue('Test message');
    expect(screen.getByTestId('select-input')).toHaveValue('option2');
    
    // Verify complete form state
    expect(JSON.parse(screen.getByTestId('form-state').textContent || '{}')).toEqual({
      name: 'John Smith',
      email: 'john@example.com',
      message: 'Test message',
      option: 'option2'
    });
  });
});
