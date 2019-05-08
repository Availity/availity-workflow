import React from 'react';
import { observer } from 'mobx-react-lite';
import { CardBody, Badge } from 'reactstrap';
import { useStateStore } from '../../stores';

export default observer(() => {
  const { request: { organization: { customerId }} } = useStateStore();

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
});
