import React, { Suspense, lazy } from 'react';
import { Router } from '@reach/router';
import { configure } from 'mobx';
import AuthorizationRequest from './Request';

const AuthorizationResponse = lazy(() => import(/* webpackChunkName: "Response" */ './Response'));

configure({ enforceActions: 'observed' });

const App = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <Router basepath="/" style={{ height: '100%' }}>
      <AuthorizationRequest path="/" />
      <AuthorizationResponse path="/response" />
    </Router>
  </Suspense>
);

export default App;
