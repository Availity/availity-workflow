import React from 'react';
import { render, cleanup, waitForElement } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import axiosMock from 'axios';
import slotmachineResponse from '../data/slotmachine.json';
import App from './App';

jest.mock('axios');

const renderApp = async () => {

  axiosMock.mockResolvedValue({
    config: { polling: false },
    data: slotmachineResponse,
    status: 202,
    statusText: 'Ok',
  });

  const { getByTestId, ...rest } = render(
      <Router history={createMemoryHistory({
        initialEntries:['/?spaceId=48C607A70B5A46A3864A34E2BDDDEA04']
      })}>
        <App />
      </Router>
  );

  await waitForElement(() => getByTestId('app-container'));

  return { getByTestId, ...rest };
};

afterEach(() => {
  cleanup();
});

describe('Claims Status', () => {
  test('renders', async () => {
    const { getByText } = await renderApp();

    await waitForElement(() => getByText('My Health Plan'));
  });
});
