import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Todos from '../Todos.jsx';
import '@testing-library/jest-dom/extend-expect';

beforeEach(() => {
  global.fetch = jest.fn((url, options) => {
    if (options && options.method === 'POST') {
      return Promise.resolve({
        json: () => Promise.resolve({ data: [{ id: 1, item: 'Test Todo' }] })
      });
    } else if (options && options.method === 'PUT') {
      return Promise.resolve({
        json: () => Promise.resolve({ data: [{ item: 'Updated Todo' }] })
      });
    } else if (options && options.method === 'DELETE') {
      return Promise.resolve({
        json: () => Promise.resolve({})
      });
    } else {
      return Promise.resolve({
        json: () => Promise.resolve({ data: [{ id: 1, item: 'Test Todo' }] })
      });
    }
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('adds a new todo', async () => {
  render(<Todos />);

  fireEvent.change(screen.getByPlaceholderText('Add a todo item'), { target: { value: 'Test Todo' } });
  fireEvent.submit(screen.getByPlaceholderText('Add a todo item'));

  expect(await screen.findByText('Test Todo')).toBeInTheDocument();
});

test('updates a todo', async () => {
  render(<Todos />);

  fireEvent.click(await screen.findByText('Update Todo'));
  fireEvent.change(screen.getByTestId('update-todo-field'), { target: { value: 'Updated Todo' } });
  expect (await screen.getByTestId('update-todo-field').value).toBe('Updated Todo')
  fireEvent.click(screen.getByTestId('update-todo-button'));
  
   expect(await screen.findByText('Updated Todo')).toBeInTheDocument();
});

test('deletes a todo', async () => {
  render(<Todos />);

  fireEvent.click(await screen.findByText('Delete Todo'));

  await waitFor(() => expect(screen.queryByText('Test Todo')).not.toBeInTheDocument());
});
