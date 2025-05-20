import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Cryptocurrency Price Predictions heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/Cryptocurrency Price Predictions/i);
  expect(headingElement).toBeInTheDocument();
});
