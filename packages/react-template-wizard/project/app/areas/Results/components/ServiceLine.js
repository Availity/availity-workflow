import React from 'react';
import { ListGroupItemStatus } from '@availity/list-group-item';
import { Row, Col } from 'reactstrap';
import Entry from './Entry';
import propTypes from './prop-types';

const ServiceLine = ({ dates, procedureCode, quantity, revenueCode, copay, deductible, paid }) => (
  <ListGroupItemStatus color="success">
    <Row>
      <Col xs={6}>
        <Entry label="Dates" value={dates} />
        <Entry label="Procedure Code" value={procedureCode} />
        <Entry label="Quantity" value={quantity} />
        <Entry label="Revenue Code" value={revenueCode} />
      </Col>
      <Col xs={6}>
        <Entry label="Copay" value={copay} />
        <Entry label="Deductible" value={deductible} />
        <Entry label="Paid" value={paid} />
      </Col>
    </Row>
  </ListGroupItemStatus>
);

ServiceLine.propTypes = {
  ...propTypes.serviceLine
}

export default ServiceLine;
