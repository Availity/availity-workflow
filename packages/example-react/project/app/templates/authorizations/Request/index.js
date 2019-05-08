import React from 'react';
import PropTypes from 'prop-types';
import { AvForm } from 'availity-reactstrap-validation';
import { Button, Card, CardBody } from 'reactstrap';

import { Agreement, Patient, Provider } from './components';
import { Footer, Header } from '../components';

const AuthorizationsRequest = ({ navigate }) => {

  const submit = () => {
    navigate('/authorizations/response');
  };

  return (
    <div className="container-sm">
      <Header />
      <AvForm onValidSubmit={submit}>
        <Card>
          <CardBody>
            <Provider />
            <Patient />
            <Agreement />
            <hr className="divider" />
            <div className="form-controls form-controls-card">
              <Button type="submit" className="btn btn-default">
                Authorize
              </Button>
            </div>
          </CardBody>
        </Card>
      </AvForm>
      <Footer />
    </div>
  );
};

AuthorizationsRequest.propTypes = {
  navigate: PropTypes.func
};
export default AuthorizationsRequest;
