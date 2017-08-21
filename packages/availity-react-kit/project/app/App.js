import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import AuthorizationsRequest from './Request';
import AuthorizationsResponse from './Response';

class App extends Component {
  constructor() {
    super();

    this.renderRootPath = ::this.renderRootPath;
  }

  renderRootPath() {
    return (
      <div>
        <Route path="/request" component={AuthorizationsRequest} />
        <Route path="/response" component={AuthorizationsResponse} />
      </div>
    );
  }

  render() {
    return (
      <BrowserRouter basename="/">
        <Route path="/" render={this.renderRootPath} />
      </BrowserRouter>
    );
  }
}

export default App;
