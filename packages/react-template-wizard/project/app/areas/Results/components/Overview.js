import React from 'react';
import { Card, CardTitle, Col, Row } from 'reactstrap';
import ListGroup from '@availity/list-group';
import ServiceLine from './ServiceLine';
import Entry from './Entry';
import propTypes from './prop-types';

const Overview = ({
  claimId,
  processed,
  patient: { accountNumber },
  statusDetail: { checkNumber, checkDate, billType, billed, paid },
  serviceLines,
}) => (
  <Card body>
    <CardTitle tag="h5" className="d-flex align-items-center">
      Claim {claimId}
      <small className="pl-2">(Processed {processed})</small>
    </CardTitle>
    <hr />
    <Row>
      <Col xs={6}>
        <Entry label="Check Number" value={checkNumber} />
        <Entry label="Check Date" value={checkDate} />
        <Entry label="Patient Account #" value={accountNumber} />
        <Entry label="Bill Type" value={billType} />
      </Col>
      <Col xs={6}>
        <Entry label="Billed" value={billed} className="bg-faded py-1 px-3" />
        <Entry label="Paid" value={paid} className="bg-dark text-white py-1 px-3" />
      </Col>
      <Col xs={12} className="mt-3">
        <ListGroup>
          {serviceLines.map(serviceLine => (
            <ServiceLine key={1} {...serviceLine} />
          ))}
        </ListGroup>
      </Col>
    </Row>
  </Card>
);

Overview.propTypes = {
  ...propTypes.claim,
};

export default Overview;
