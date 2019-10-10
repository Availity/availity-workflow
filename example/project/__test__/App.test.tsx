import React from 'react';
import { render, waitForElement } from '@testing-library/react';
import App from '../app/App';


describe("App", () => {
  test('renders without error', async () => {
    const { getByText } = render(<App />);

    await waitForElement(() => getByText('Test Card Header'));
  })
})
