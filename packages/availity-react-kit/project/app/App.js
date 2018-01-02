import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import AuthorizationsRequest from './request';
import AuthorizationsResponse from './response';

const App = () => (
  <BrowserRouter basename="/">
    <div>
      <Route exact path="/" component={AuthorizationsRequest} />
      <Route path="/response" component={AuthorizationsResponse} />
    </div>
  </BrowserRouter>
);

export default App;
