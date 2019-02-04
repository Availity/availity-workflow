import React from 'react';
import { inject, observer } from 'mobx-react';
import { CardBody, Badge } from 'reactstrap';
import propTypes from '../props';

const Transaction = ({ stateStore: { request } }) => {
  const { organization } = request;
  const { customerId } = organization;
  return (
    <CardBody>
      <div className="card-header-secondary">
        <small className="text-label text-label-inline">Transaction ID</small>
        <Badge color="info">236316981</Badge>
        <small className="text-label text-label-inline">Customer ID</small>
        <Badge color="info">{customerId}</Badge>
      </div>
    </CardBody>
  );
};

Transaction.propTypes = propTypes;

export default inject('stateStore', 'appStore')(observer(Transaction));
