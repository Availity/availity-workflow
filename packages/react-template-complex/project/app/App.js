import React, { useMemo} from 'react';
import { Router } from '@reach/router';
import { Container } from 'reactstrap';
import Spaces from '@availity/spaces';
import qs from 'query-string';
import AuthorizationRequest from './areas/Request';
import AuthorizationResponse from './areas/Response';

const getQueryString = pathname => pathname.substring(pathname.lastIndexOf('?'), pathname.length);

const App = () => {
  const queryParams = qs.parse(getQueryString(window.location.href));

  const spaceId = useMemo(() => queryParams.spaceId,[queryParams]);

  return (
    <Spaces spaceIds={[spaceId]} clientId="test">
      <Container>
        <Router style={{ height: '100%' }}>
          <AuthorizationRequest spaceId={spaceId} path="/" />
          <AuthorizationResponse spaceId={spaceId} path="/response" />
        </Router>
      </Container>
    </Spaces>
  );
};
export { AuthorizationRequest, AuthorizationResponse };

export default App;
