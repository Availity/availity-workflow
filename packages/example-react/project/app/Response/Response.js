import React from 'react';
import { Card, CardBody } from 'reactstrap';
import { Footer, Header } from '~/shared';
import { Patient, Status, Transaction } from './components';
import propTypes from './props';

const AuthorizationsResponse = () => (
  <div className="container-sm">
    <Header />
    <Transaction />
    <Card>
      <CardBody>
        <Patient />
        <Status />
      </CardBody>
    </Card>
    <Footer />
  </div>
);

AuthorizationsResponse.propTypes = propTypes;

export default AuthorizationsResponse;
