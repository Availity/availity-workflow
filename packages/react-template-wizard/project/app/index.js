import React from 'react';
import { render } from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';
import 'availity-uikit/scss/_bootstrap.scss';
import 'react-block-ui/style.css';
import App from './App';

render(
  <Router>
    <App  />
  </Router>,
  document.querySelector('#root')
);
