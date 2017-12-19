// ES6 Symbol Polyfill for IE11
import 'es6-symbol/implement';
import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

// Styles
import 'availity-uikit/scss/_bootstrap.scss';
import './index.scss';

import App from './App';

// ES6 Promise Polyfill for IE11
require('es6-promise').polyfill();

const render = Component =>
  // eslint-disable-next-line react/no-render-return-value
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('root')
  );

// Hot Module Replacement API
if (__DEV__ && module.hot) {
  module.hot.accept('./App', () => render(App));
}

if (!__TEST__) {
  render(App);
}
