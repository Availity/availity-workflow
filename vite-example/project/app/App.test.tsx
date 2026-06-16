import { describe, test, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

vi.mock('@availity/element', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@availity/element')>();
  return { ...actual, Authorize: ({ children }: { children: React.ReactNode }) => children };
});

vi.mock('@availity/api-axios', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@availity/api-axios')>();
  return { ...actual, avUserApi: { me: vi.fn().mockResolvedValue({ firstName: 'John', lastName: 'Doe' }) } };
});

vi.mock('@availity/hooks', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@availity/hooks')>();
  return { ...actual, useCurrentUser: () => ({ data: { firstName: 'John', lastName: 'Doe' }, isLoading: false }) };
});

// eslint-disable-next-line import/first
import App from './App';

describe('App', () => {
  test('renders without error', () => {
    render(<App />);
    expect(screen.getByText('Sample Project')).toBeDefined();
  });

  test('displays current user name', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('Welcome, John Doe')).toBeDefined();
    });
  });
});
