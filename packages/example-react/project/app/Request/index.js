import React, { Component } from 'react';
import { AvForm } from 'availity-reactstrap-validation';
import { Button, Card, CardBody } from 'reactstrap';
import { navigate } from '@reach/router';

import { Agreement, Patient, Provider } from './components';
import { Footer, Header } from '../components';

class AuthorizationsRequest extends Component {
  submit = () => {
    navigate(`/response`);
  };

  render() {

    return (
      <div className="container-sm">
        <Header />
        <AvForm onValidSubmit={this.submit}>
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
  }
}

export default AuthorizationsRequest;
