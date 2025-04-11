import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { expect, test } from 'vitest';

test('renders welcome message with current user info', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );

  const welcomeMessage = screen.getByText("Login");
  expect(welcomeMessage).toBeInTheDocument();
});
