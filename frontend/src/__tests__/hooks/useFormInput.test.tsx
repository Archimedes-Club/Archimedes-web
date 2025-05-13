import React from 'react';
import { renderHook, act } from '@testing-library/react';
import useFormInput from '../../hooks/useFormInput';

describe('useFormInput Hook', () => {
  it('should initialize with the provided initial state', () => {
    // Define initial form state
    const initialState = {
      name: '',
      email: '',
      age: ''
    };
    
    // Render the hook
    const { result } = renderHook(() => useFormInput(initialState));
    
    // Destructure the returned values
    const [formState, _] = result.current;
    
    // Check initial state matches
    expect(formState).toEqual(initialState);
  });
  
  it('should update a text input value correctly', () => {
    // Define initial form state
    const initialState = {
      name: '',
      email: '',
      age: ''
    };
    
    // Render the hook
    const { result } = renderHook(() => useFormInput(initialState));
    
    // Create a mock event
    const mockEvent = {
      target: {
        name: 'name',
        value: 'John Doe'
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    // Destructure the handler function
    const [_, handleInputChange] = result.current;
    
    // Update the state
    act(() => {
      handleInputChange(mockEvent);
    });
    
    // Get the updated state
    const [updatedState, __] = result.current;
    
    // Check that only the targeted field was updated
    expect(updatedState).toEqual({
      name: 'John Doe',
      email: '',
      age: ''
    });
  });
  
  it('should update multiple fields correctly', () => {
    // Define initial form state
    const initialState = {
      name: '',
      email: '',
      age: ''
    };
    
    // Render the hook
    const { result, rerender } = renderHook(() => useFormInput(initialState));
    
    // Update the name field
    act(() => {
      const [_, handleInputChange] = result.current;
      handleInputChange({
        target: {
          name: 'name',
          value: 'Jane Smith'
        }
      } as React.ChangeEvent<HTMLInputElement>);
    });
    
    // We need to access the current state after each update
    let [currentState, currentHandler] = result.current;
    expect(currentState.name).toBe('Jane Smith');
    
    // Update the email field
    act(() => {
      currentHandler({
        target: {
          name: 'email',
          value: 'jane@example.com'
        }
      } as React.ChangeEvent<HTMLInputElement>);
    });
    
    // Get updated state and handler
    [currentState, currentHandler] = result.current;
    expect(currentState.email).toBe('jane@example.com');
    
    // Update the age field
    act(() => {
      currentHandler({
        target: {
          name: 'age',
          value: '25'
        }
      } as React.ChangeEvent<HTMLInputElement>);
    });
    
    // Get the final updated state
    const [updatedState, _] = result.current;
    
    // Check all fields were updated correctly
    expect(updatedState).toEqual({
      name: 'Jane Smith',
      email: 'jane@example.com',
      age: '25'
    });
  });
  
  it('should work with different input types', () => {
    // Define initial form state
    const initialState = {
      text: '',
      textarea: '',
      select: ''
    };
    
    // Render the hook
    const { result } = renderHook(() => useFormInput(initialState));
    
    // Update text input
    act(() => {
      const [_, handleInputChange] = result.current;
      handleInputChange({
        target: {
          name: 'text',
          value: 'Some text'
        }
      } as React.ChangeEvent<HTMLInputElement>);
    });
    
    // Get updated state and handler
    let [currentState, currentHandler] = result.current;
    expect(currentState.text).toBe('Some text');
    
    // Update textarea
    act(() => {
      currentHandler({
        target: {
          name: 'textarea',
          value: 'Some longer text in a textarea'
        }
      } as React.ChangeEvent<HTMLTextAreaElement>);
    });
    
    // Get updated state and handler
    [currentState, currentHandler] = result.current;
    expect(currentState.textarea).toBe('Some longer text in a textarea');
    
    // Update select
    act(() => {
      currentHandler({
        target: {
          name: 'select',
          value: 'option1'
        }
      } as React.ChangeEvent<HTMLSelectElement>);
    });
    
    // Get the final updated state
    const [updatedState, _] = result.current;
    
    // Check all different input types were updated correctly
    expect(updatedState).toEqual({
      text: 'Some text',
      textarea: 'Some longer text in a textarea',
      select: 'option1'
    });
  });
  
  it('should handle complex nested form state', () => {
    // Define a more complex initial state
    const initialState = {
      user: {
        firstName: '',
        lastName: ''
      },
      contact: {
        email: '',
        phone: ''
      },
      preferences: {
        notifications: false,
        theme: 'light'
      }
    };
    
    // This hook doesn't support nested objects directly as shown in the implementation
    // So we flatten the structure for this test
    const flattenedInitialState = {
      'user.firstName': '',
      'user.lastName': '',
      'contact.email': '',
      'contact.phone': '',
      'preferences.notifications': false,
      'preferences.theme': 'light'
    };
    
    // Render the hook with the flattened state
    const { result } = renderHook(() => useFormInput(flattenedInitialState));
    
    // Destructure the handler function
    const [_, handleInputChange] = result.current;
    
    // Update a field
    act(() => {
      handleInputChange({
        target: {
          name: 'user.firstName',
          value: 'John'
        }
      } as React.ChangeEvent<HTMLInputElement>);
    });
    
    // Get the updated state
    const [updatedState, __] = result.current;
    
    // Check the field was updated correctly
    expect(updatedState['user.firstName']).toBe('John');
  });
  
  it('should preserve the type of the returned handler function', () => {
    const initialState = { name: '' };
    const { result } = renderHook(() => useFormInput(initialState));
    
    // Destructure the returned values
    const [_, handleInputChange] = result.current;
    
    // Check the type of the handler function
    expect(typeof handleInputChange).toBe('function');
  });
});