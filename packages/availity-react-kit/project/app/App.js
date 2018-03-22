import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import AuthorizationRequest from './request';
import AuthorizationResponse from './response';

const App = () => (
  <BrowserRouter basename="/">
    <div>
      <Route exact path="/" component={AuthorizationRequest} />
      <Route path="/response" component={AuthorizationResponse} />
    </div>
  </BrowserRouter>
);

export default App;
