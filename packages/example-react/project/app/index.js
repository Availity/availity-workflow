import React from 'react';
import { render } from 'react-dom';
import 'availity-uikit/scss/_bootstrap.scss';
import 'react-block-ui/style.css';

// Below are needed because https://reactjs.org/docs/javascript-environment-requirements.html
import 'es6-symbol/implement';
import 'es6-promise/auto';

import './index.scss';
import './index.css';

import App from './App';

render(<App />, document.querySelector('#root'));
