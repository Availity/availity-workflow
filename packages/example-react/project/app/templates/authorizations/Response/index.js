import React from 'react';
import { Card, CardBody } from 'reactstrap';
import { Footer, Header } from '../components';
import { Patient, Status, Transaction } from './components';

export default () => (
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
