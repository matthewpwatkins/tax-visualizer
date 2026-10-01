import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the calculator with no results until income is entered', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /tax visualizer/i })).toBeInTheDocument();
  expect(document.getElementById('tax-results')).toBeNull();
});
