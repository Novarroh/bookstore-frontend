import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { vi } from 'vitest';
import App from './App';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Register from './Pages/Register';
import UserBooks from './Pages/UserBooks';

// Mock the necessary modules
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

vi.mock('./Pages/Home', () => ({ 
  default: vi.fn(({ currentUser, users }) => (
    <div data-testid="home-page">
      <span>Home Component</span>
      <span data-testid="current-user">{currentUser?.first_name}</span>
      <span data-testid="users-count">{users?.length}</span>
    </div>
  ))
}));

vi.mock('./Pages/Login', () => ({
  default: vi.fn(({ onLogin }) => (
    <div data-testid="login-page">
      <span>Login Component</span>
      <button 
        data-testid="login-btn" 
        onClick={() => onLogin('test@example.com', 'password')}
      >
        Login
      </button>
    </div>
  ))
}));

vi.mock('./Pages/Register', () => ({
  default: vi.fn(() => <div data-testid="register-page">Register Component</div>)
}));

vi.mock('./Pages/UserBooks', () => ({
  default: vi.fn(({ bookOptions, books, currentUser }) => (
    <div data-testid="user-books-page">
      <span>UserBooks Component</span>
      <span data-testid="book-options-count">{bookOptions?.length}</span>
      <span data-testid="books-count">{Object.keys(books || {}).length}</span>
      <span data-testid="user-name">{currentUser?.first_name}</span>
    </div>
  ))
}));

// Mock fetch API
global.fetch = vi.fn();
const mockNavigate = vi.fn();

// Helper function to setup the component with specific route
const renderWithRouter = (initialRoute) => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <App />
    </MemoryRouter>
  );
};

// Reset mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
  mockNavigate.mockClear();

  // Setup default fetch mock responses
  global.fetch.mockImplementation((url) => {
    if (url === 'http://localhost:5000/api/users') {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          { id: 1, first_name: 'John', last_name: 'Doe', role: 'admin' },
          { id: 2, first_name: 'Jane', last_name: 'Smith', role: 'customer' }
        ])
      });
    } else if (url === '/data/books.json') {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ 
          book1: { id: 'book1', title: 'Book 1' }, 
          book2: { id: 'book2', title: 'Book 2' } 
        })
      });
    } else if (url === '/data/bookOptions.json') {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          { id: 1, name: 'Option 1' },
          { id: 2, name: 'Option 2' }
        ])
      });
    } else if (url === 'http://localhost:5000/api/users/login') {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ 
          id: 1, 
          first_name: 'John', 
          last_name: 'Doe', 
          role: 'admin' 
        })
      });
    }
  });
});

describe('App Component', () => {
  test('renders Login component by default on unknown route', async () => {
    renderWithRouter('/unknown-route');
    
    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });

  test('renders Login component on /login route', () => {
    renderWithRouter('/login');
    
    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });

  test('renders Register component on /register route', () => {
    renderWithRouter('/register');
    
    expect(screen.getByTestId('register-page')).toBeInTheDocument();
  });

  test('fetches users, books, and book options on initial load', async () => {
    renderWithRouter('/login');
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(3);
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:5000/api/users');
      expect(global.fetch).toHaveBeenCalledWith('/data/books.json');
      expect(global.fetch).toHaveBeenCalledWith('/data/bookOptions.json');
    });
  });

  test('handles failed API fetches gracefully', async () => {
    // Mock console.error to prevent test output pollution
    const originalConsoleError = console.error;
    console.error = vi.fn();
    
    // Make all fetch calls fail
    global.fetch.mockImplementation(() => Promise.reject(new Error('Network error')));
    
    renderWithRouter('/login');
    
    // Wait for all fetch calls to complete
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(3);
      expect(console.error).toHaveBeenCalledTimes(3);
    });
    
    // Restore console.error
    console.error = originalConsoleError;
  });

  test('handles login and navigates to Home for admin user', async () => {
    global.fetch.mockImplementation((url, options) => {
      if (url === 'http://localhost:5000/api/users/login') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ 
            id: 1, 
            first_name: 'John', 
            last_name: 'Doe', 
            role: 'admin' 
          })
        });
      }
      // Default mocks for other fetch calls
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([])
      });
    });

    renderWithRouter('/login');
    
    // Trigger login
    fireEvent.click(screen.getByTestId('login-btn'));
    
    await waitFor(() => {
      // Check if navigate was called with correct route
      expect(mockNavigate).toHaveBeenCalledWith('/Home');
    });
  });

  test('handles login and navigates to user page for customer', async () => {
    global.fetch.mockImplementation((url, options) => {
      if (url === 'http://localhost:5000/api/users/login') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ 
            id: 2, 
            first_name: 'Jane', 
            last_name: 'Smith', 
            role: 'customer' 
          })
        });
      }
      // Default mocks for other fetch calls
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([])
      });
    });

    renderWithRouter('/login');
    
    // Trigger login
    fireEvent.click(screen.getByTestId('login-btn'));
    
    await waitFor(() => {
      // Check if navigate was called with correct route for customer
      expect(mockNavigate).toHaveBeenCalledWith('/user/2');
    });
  });

  test('handles login failure', async () => {
    global.fetch.mockImplementation((url, options) => {
      if (url === 'http://localhost:5000/api/users/login') {
        return Promise.resolve({
          ok: false,
          status: 401,
          statusText: 'Unauthorized'
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([])
      });
    });

    // Mock window.alert
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    
    renderWithRouter('/login');
    
    // Trigger login
    fireEvent.click(screen.getByTestId('login-btn'));
    
    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('Invalid credentials');
      expect(mockNavigate).not.toHaveBeenCalled();
    });
    
    alertMock.mockRestore();
  });

  test('displays welcome message and logout button when user is logged in', async () => {
    // Mock a logged-in user
    let currentUserState = null;
    
    global.fetch.mockImplementation((url, options) => {
      if (url === 'http://localhost:5000/api/users/login') {
        currentUserState = { 
          id: 1, 
          first_name: 'John', 
          last_name: 'Doe', 
          role: 'admin' 
        };
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(currentUserState)
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([])
      });
    });

    renderWithRouter('/login');
    
    // Trigger login
    fireEvent.click(screen.getByTestId('login-btn'));
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/Home');
    });
    
    // Re-render with updated state
    renderWithRouter('/Home');
    
    // We need to manually update the currentUser state since we're using mocked components
    // In a real application, the state would be updated automatically
    await waitFor(() => {
      const welcomeMessage = screen.getByText(/Welcome, John Doe/);
      expect(welcomeMessage).toBeInTheDocument();
      
      const logoutButton = screen.getByText('Logout');
      expect(logoutButton).toBeInTheDocument();
    });
  });


});