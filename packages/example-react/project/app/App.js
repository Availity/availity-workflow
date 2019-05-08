import React from 'react';
import { Router } from '@reach/router';
import { AuthorizationResponse, AuthorizationRequest } from './templates/authorizations/App';
import Sso from './templates/sso/App';

export default () => (
  <Router>
    <AuthorizationRequest exact path="/authorizations" />
    <AuthorizationResponse exact path="/authorizations/response" />
    <Sso path="/sso" />
  </Router>
)
