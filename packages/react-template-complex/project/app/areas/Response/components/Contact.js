import React from 'react';
import { Card, CardTitle, Row } from 'reactstrap';
import ResponseField from './ResponseField';

export default () => (
  <Card body className="mb-3">
    <CardTitle className="card-title-secondary">Payer Contact Information</CardTitle>
    <Row>
      <ResponseField sm="3" label="Contact Name" value="Aetna" />
      <ResponseField sm="3" label="Phone Number" value="(800) 955-5682" />
    </Row>
  </Card>
);
