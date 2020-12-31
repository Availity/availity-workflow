import * as React from 'react';
import { render } from 'react-dom';
import './index.scss';
import 'react-block-ui/style.css';
import '@availity/yup';
import App from './App.tsx';

render(<App />, document.querySelector('#root'));
