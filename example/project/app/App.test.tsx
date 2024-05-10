import { render } from '@testing-library/react';

import { chain, nullChain } from '@/chain';

import App from './App';

describe('App', () => {
  test('renders without error', () => {
    const { getByText } = render(<App />);
    expect(getByText('Test Card Header')).toBeDefined();
  });

  test('optional chaining field has initial value', () => {
    // This test makes sure you are at least developing using a newer version of Node
    // You will still need to test transpiled code
    const { getByDisplayValue } = render(<App />);
    expect(getByDisplayValue(chain)).toBeDefined();
  });

  test('nullish coalesced field has initial value', () => {
    // This test makes sure you are at least developing using a newer version of Node
    // You will still need to test transpiled code
    const { getByDisplayValue } = render(<App />);
    expect(getByDisplayValue(nullChain)).toBeDefined();
  });
});
