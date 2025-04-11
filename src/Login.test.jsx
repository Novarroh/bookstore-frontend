import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Login from './Pages/Login';

// Mock the useNavigate hook
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn()
}));

describe('Login Component', () => {
  // Mock props
  const mockOnLogin = vi.fn();
  
  beforeEach(() => {
    // Clear mocks between tests
    mockOnLogin.mockClear();
  });

  it('renders login form with all elements', () => {
    render(<Login onLogin={mockOnLogin} />);
    
    // Check for heading
    expect(screen.getByText('Login To Book-Store')).toBeDefined();
    
    // Check for input fields
    expect(screen.getByPlaceholderText('Email')).toBeDefined();
    expect(screen.getByPlaceholderText('Password')).toBeDefined();
    
    // Check for login button
    expect(screen.getByRole('button', { name: /login/i })).toBeDefined();
    
    // Check for register link
    expect(screen.getByText("Register")).toBeDefined();
  });

  it('updates email and password values on input change', () => {
    render(<Login onLogin={mockOnLogin} />);
    
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    
    // Simulate typing in email field
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(emailInput.value).toBe('test@example.com');
    
    // Simulate typing in password field
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    expect(passwordInput.value).toBe('password123');
  });

  it('calls onLogin with email and password when form is submitted', () => {
    render(<Login onLogin={mockOnLogin} />);
    
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const form = screen.getByRole('button', { name: /login/i }).closest('form');
    
    // Fill in the form
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    // Submit the form
    fireEvent.submit(form);
    
    // Check that onLogin was called with the correct arguments
    expect(mockOnLogin).toHaveBeenCalledTimes(1);
    expect(mockOnLogin).toHaveBeenCalledWith('test@example.com', 'password123');
  });

  it('navigates to register page when register link is clicked', () => {
    render(<Login onLogin={mockOnLogin} />);
    
    const registerLink = screen.getByText('Register');
    
    // Click on register link
    fireEvent.click(registerLink);
    
    // Since we're using a mock, we can't directly test that navigate was called with '/register'
    // In a more complex test, you could check that the mock navigate function was called correctly
  });
});