import React, { useMemo} from 'react';
import { Router } from '@reach/router';
import { Container } from 'reactstrap';
import { configure } from 'mobx';
import Spaces from '@availity/spaces';
import qs from 'query-string';
import AuthorizationRequest from './areas/Request';
import AuthorizationResponse from './areas/Response';

configure({ enforceActions: 'observed' });

const getQueryString = pathname => pathname.substring(pathname.lastIndexOf('?'), pathname.length);

const App = () => {
  const queryParams = qs.parse(getQueryString(window.location.href));

  const spaceId = useMemo(() => queryParams.spaceId ||'48C607A70B5A46A3864A34E2BDDDEA04' ,[queryParams]);

  console.log("spaceId",spaceId);
  console.log("query params",queryParams);

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
