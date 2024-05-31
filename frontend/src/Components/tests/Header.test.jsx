import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from '../Header.jsx';

test('renders the header with the correct title', () => {
  render(<Header title="Todos" />);
  expect(screen.getByText('Todos')).toBeInTheDocument();
});