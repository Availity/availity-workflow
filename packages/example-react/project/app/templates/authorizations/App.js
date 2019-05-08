import React from 'react';
import { Router } from '@reach/router';
import { configure } from 'mobx';
import AuthorizationRequest from './Request';
import AuthorizationResponse from './Response';

configure({ enforceActions: 'observed' });

const App = () => (
  <Router style={{ height: '100%' }} primary={false}>
    <AuthorizationRequest path="/" />
    <AuthorizationResponse path="/response" />
  </Router>
);

export { AuthorizationRequest, AuthorizationResponse }

export default App;
