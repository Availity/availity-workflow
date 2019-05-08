import React from 'react';
import { Router, Redirect } from '@reach/router';
import { AuthorizationResponse, AuthorizationRequest } from './templates/authorizations/App';
import Sso from './templates/sso/App';

const RedirectRoute = () => <Redirect to='/authorizations' noThrow/>;

export default () => (
  <Router>
    <RedirectRoute path="/" />
    <AuthorizationRequest path="/authorizations" />
    <AuthorizationResponse exact path="/authorizations/response" />
    <Sso path="/sso" />
  </Router>
)
