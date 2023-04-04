import { render, screen } from '@testing-library/react';
import Voice from './App';

test('renders learn react link', () => {
  render(<Voice />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
