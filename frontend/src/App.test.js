import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // Add this line
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/Water Intake Reminder/i); 
  expect(linkElement).toBeInTheDocument();
});
