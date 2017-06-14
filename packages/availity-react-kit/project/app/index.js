import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

// Styles
import 'availity-uikit/scss/_bootstrap.scss';
import './index.scss';

import App from './App';

const render = Component => ReactDOM.render(
  <AppContainer>
    <Component />
  </AppContainer>,
  document.getElementById('root')
);

// Hot Module Replacement API
if (__DEV__ && module.hot) {
  module.hot.accept('./App', () => render(App));
}

if(!__TEST__) {
  render(App);
}
