import React from 'react';
import { HashRouter, Route } from 'react-router-dom';
import { configure } from 'mobx';
import { Provider } from 'mobx-react';
import { appStore, stateStore } from './stores';
import AuthorizationRequest from './Request';
import AuthorizationResponse from './Response';

const stores = { appStore, stateStore };
window.stateStore = stateStore;
configure({ enforceActions: true });

const App = () => (
  <Provider {...stores}>
    <HashRouter basename="/">
      <div>
        <Route exact path="/" component={AuthorizationRequest} />
        <Route path="/response" component={AuthorizationResponse} />
      </div>
    </HashRouter>
  </Provider>
);

export default App;
