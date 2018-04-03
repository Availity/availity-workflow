// ES6 Symbol Polyfill for IE11
import 'es6-symbol/implement';
import 'es6-promise/auto';
import React from 'react';
import ReactDOM from 'react-dom';
import 'availity-uikit/scss/_bootstrap.scss';
import './index.scss';
import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));
