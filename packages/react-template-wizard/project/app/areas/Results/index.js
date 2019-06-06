import React, { useState, useEffect } from 'react';
import { CardBody, Row, Col, Spinner } from 'reactstrap';
import ListGroup from '@availity/list-group';
import ClaimCard from './components/ClaimCard';
import Overview from './components/Overview';
import ClaimApi from '../../resources/ClaimApi';

const useClaim = transId => {
  const [claim, setClaim] = useState(null);

  const fetchClaim = async () => {
    const response = await ClaimApi.get(transId);

    setClaim({
      ...response.data,
    });
  };

  useEffect(() => {
    fetchClaim();
  }, [transId]);

  return claim;
};

export default () => {
  const claim = useClaim('332306663284822124');


  if(!claim) {
    return null;
  }

  return (
    <CardBody>
      <Row>
        <Col xs={12} md={3}>
          <ListGroup cards>
            <ClaimCard {...claim} />
          </ListGroup>
        </Col>
        <Col xs={12} md={9}>
          <Overview {...claim} />
        </Col>
      </Row>
    </CardBody>
  );
};
