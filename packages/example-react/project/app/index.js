import React from 'react';
import { render } from 'react-dom';
import { LocationProvider } from '@reach/router';
import 'availity-uikit/scss/_bootstrap.scss';
import 'react-block-ui/style.css';
import hashHistory from './hashHistory';
import App from './App';

render(
  <LocationProvider history={hashHistory}>
    <App  />
  </LocationProvider>,
  document.querySelector('#root')
);
