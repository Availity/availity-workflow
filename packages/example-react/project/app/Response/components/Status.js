import React from 'react';
import { inject, observer } from 'mobx-react';
import { Row, Col } from 'reactstrap';
import propTypes from '../props';

const Status = () => (
  <Row>
    <Col sm="3">
      <h5 className="text-label">Status</h5>
      <p>good</p>
    </Col>
    <Col sm="3">
      <h5 className="text-label">Diagnosis Version</h5>
      <p>28347</p>
    </Col>
    <Col sm="3">
      <h5 className="text-label">Request Type</h5>
      <p>boom</p>
    </Col>
    <Col sm="3">
      <h5 className="text-label">Payer</h5>
      <p>Acme Health</p>
    </Col>
  </Row>
);

Status.propTypes = propTypes;

export default inject('stateStore', 'appStore')(observer(Status));
