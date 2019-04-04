import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { CardBody, Badge } from 'reactstrap';
import { AppStore } from '~/stores';
import propTypes from '../props';

const Transaction = () => {
  const { request: {organization} } = useContext(AppStore);
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

export default observer(Transaction);
