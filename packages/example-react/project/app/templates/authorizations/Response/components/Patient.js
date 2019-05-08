import React from 'react';
import { Row, Col } from 'reactstrap';

export default () => (
  <Row>
    <Col sm="3">
      <h5 className="text-label">Certification Number</h5>
      <p>383837</p>
    </Col>
    <Col sm="3">
      <h5 className="text-label">Patient Name</h5>
      <p>Jane Smith</p>
    </Col>
    <Col sm="3">
      <h5 className="text-label">Patient Date of Birth</h5>
      <p>10/10/2011</p>
    </Col>
    <Col sm="3">
      <h5 className="text-label">Member ID</h5>
      <p>1234343</p>
    </Col>
  </Row>
);
