import React from 'react';
import { observer } from 'mobx-react';
import { Badge, Card, CardBlock, Col, Row } from 'reactstrap';
import { Footer, Header } from '../components';

const AuthorizationsResponse = () => (
  <div className="container-sm">
    <Header />
    <Card>
      <CardBlock>
        <div className="card-header-secondary">
          <small className="text-label text-label-inline">Transaction ID</small>&nbsp;
          <Badge color="info">236316981</Badge>&nbsp;
          <small className="text-label text-label-inline">Customer ID</small>&nbsp;
          <Badge color="info" />
        </div>
      </CardBlock>

      <CardBlock>
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
      </CardBlock>
    </Card>
    <Footer />
  </div>
);

export default observer(AuthorizationsResponse);
