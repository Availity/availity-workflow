/* global it */

import React from 'react';
import ReactDOM from 'react-dom';
import Request from './Request';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Request />, div);
});
