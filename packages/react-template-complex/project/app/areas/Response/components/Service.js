import React, { Fragment } from 'react';
import { Card, CardTitle, Row, Col } from 'reactstrap';
import ResponseField from './ResponseField';

export const AdditionalService = () => (
  <Card body className="mb-3">
    <CardTitle className="card-title-secondary">Additional Services Information</CardTitle>
    <Row>
      <Col sm="3">
        <ResponseField tag={Fragment} label="Procedure Code" value="49000" />
        <ResponseField tag={Fragment} label="Status" value="No action required" />
      </Col>
      <ResponseField label="Date of Service" value="12/24/2012 - 12/24/2012" sm="4" />
    </Row>
  </Card>
);

export default () => (
  <Card body className="mb-3">
    <CardTitle className="card-title-secondary">Service Information</CardTitle>
    <Row>
      <Col sm="3">
        <ResponseField tag={Fragment} label="Service Type/Quantity" value="3 Days" />
        <ResponseField tag={Fragment} label="Admission Type" value="Elective" />
      </Col>
      <Col sm="3">
        <ResponseField tag={Fragment} label="Place of Service" value="Inpatient Hospital" />
        <ResponseField tag={Fragment} label="Type of Service" value="Cardiac" />
      </Col>
      <ResponseField label="Service/Admission Date" value="12/24/2012" sm="3" />
    </Row>
  </Card>
);
