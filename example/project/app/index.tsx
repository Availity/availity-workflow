import * as React from 'react';
import { createRoot } from 'react-dom/client';
import './index.scss';
import 'react-block-ui/style.css';
import '@availity/yup';
import App from './App';

const container = document.getElementById('app');
const root = createRoot(container);

root.render(<App />);
