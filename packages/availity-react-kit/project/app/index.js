import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import 'react-select';
import 'reactstrap';
import 'tether';

// Styles
import 'availity-uikit/scss/_bootstrap.scss';
import 'react-select/dist/react-select.css';
import './index.scss';

import App from './App';

ReactDOM.render(
  <AppContainer>
    <App />
  </AppContainer>,
  document.getElementById('root')
);

// Hot Module Replacement API
if (module.hot) {

  module.hot.accept('./App', () => {
    const NextApp = require('./App').default;
    ReactDOM.render(
      <AppContainer>
        <NextApp />
      </AppContainer>,
      document.getElementById('root')
    );
  });

}
