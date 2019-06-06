import React from 'react';
import { CardBody, Row, Col } from 'reactstrap';
import ListGroup from '@availity/list-group';
import ClaimCard from './components/ClaimCard';
import Overview from './components/Overview';

const claim =   {
  claimId: '3252345',
  dates: '12/12/2012 - 12/12/2012',
  status: 'FINALIZED',
  processed: '12/12/2012',
  billed: '$XXXX.XX',
  paid: '$XXXX.XX',
  patient: {
    accountNumber: '11111111',
  },
  statusDetail: {
    checkNumber: '123456783',
    checkDate: '03/05/2017',
    billType: '131',
    billed: '$XXXX.XX',
    paid: '$XXXX.XX',
  },
  serviceLines: [
    {
      dates: '02/17/2012 - 02/17/2017',
      procedureCode: 'JH3532',
      quantity: 1,
      revenueCode: '0636',
      copay: 'N/A',
      deductible: 'N/A',
      paid: '$XXXX.XX',
    },
  ],
};


export default () => (
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
