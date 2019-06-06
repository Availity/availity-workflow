import React from 'react';
import { Router } from '@reach/router';
import SsoForm from './areas/SsoForm';

export default () => (
  <Router>
    <SsoForm path="/" />
  </Router>
);

