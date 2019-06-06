import React from 'react';
import PropTypes from 'prop-types';
import PageHeader from '@availity/page-header';
import { Container, Button } from 'reactstrap';
import { AvForm } from 'availity-reactstrap-validation';
import { Basic, Information, Provider } from './components';

const AuthorizationRequest = ({ spaceId, navigate }) => (
  <Container>
    <PageHeader path="/" appName="Authorization Request" spaceId={spaceId} />
    <AvForm onValidSubmit={() => navigate('response')}>
      <Basic />
      <Information />
      <Provider />
      <div className="form-controls">
        <Button type="submit" color="primary" className="form-controls-right">
          Submit
        </Button>
      </div>
    </AvForm>
  </Container>
);

AuthorizationRequest.propTypes = {
  navigate: PropTypes.func,
  spaceId: PropTypes.string
};

export default AuthorizationRequest;
