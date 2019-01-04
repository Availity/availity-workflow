import React, { Suspense, lazy } from 'react';
import { Router } from '@reach/router';
import { configure } from 'mobx';
import { Provider } from 'mobx-react';
import { appStore, stateStore } from './stores';
import AuthorizationRequest from './Request';
import 'react-table/react-table.css';

const AuthorizationResponse = lazy(() => import(/* webpackChunkName: "Response" */ './Response'));

const stores = { appStore, stateStore };
window.stateStore = stateStore;
configure({ enforceActions: 'observed' });

const App = () => (
  <Provider {...stores}>
    <Suspense fallback={<div>Loading...</div>}>
      <Router basepath="/" style={{ height: '100%' }}>
        <AuthorizationRequest path="/" />
        <AuthorizationResponse path="/response" />
      </Router>
    </Suspense>
  </Provider>
);

export default App;
