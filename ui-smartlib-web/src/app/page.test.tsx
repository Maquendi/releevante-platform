import { expect, test } from 'vitest'; 
import { render, screen } from '@testing-library/react';
import Home from './page'; 

test('renders the Home component with the correct text', () => {
  render(<Home />);
  const textElement = screen.getByText("ui smart library web");
  expect(textElement).toBeInTheDocument();
});
