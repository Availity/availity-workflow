import React from 'react';
import { observer } from 'mobx-react';
import { Badge, Card, CardBlock, Col, Row } from 'reactstrap';
import uiStore from '../stores/uiStore';
import { Footer, Header } from '../components';

function AuthorizationsResponse() {
  const { currentResponse } = uiStore;

  if (currentResponse) {
    const {
      customerId,
      certificationNumber,
      patient,
      subscriber,
      status,
      diagnoses,
      requestType,
      payer
    } = uiStore.currentResponse;

    return (
      <div className="container-sm">
        <Header />
        <Card>
          <CardBlock>
            <div className="card-header-secondary">
              <small className="text-label text-label-inline">Transaction ID</small>&nbsp;
              <Badge color="info">236316981</Badge>&nbsp;
              <small className="text-label text-label-inline">Customer ID</small>&nbsp;
              <Badge color="info">{customerId}</Badge>
            </div>
          </CardBlock>

          <CardBlock>
            <Row>
              <Col sm="3">
                <h5 className="text-label">Certification Number</h5>
                <p>{certificationNumber}</p>
              </Col>
              <Col sm="3">
                <h5 className="text-label">Patient Name</h5>
                <p>
                  {patient.firstName} {patient.lastName}
                </p>
              </Col>
              <Col sm="3">
                <h5 className="text-label">Patient Date of Birth</h5>
                <p>{patient.birthDate}</p>
              </Col>
              <Col sm="3">
                <h5 className="text-label">Member ID</h5>
                <p>{subscriber.memberId}</p>
              </Col>
            </Row>

            <Row>
              <Col sm="3">
                <h5 className="text-label">Status</h5>
                <p>{status}</p>
              </Col>
              <Col sm="3">
                <h5 className="text-label">Diagnosis Version</h5>
                <p>{diagnoses[0].qualifier}</p>
              </Col>
              <Col sm="3">
                <h5 className="text-label">Request Type</h5>
                <p>{requestType}</p>
              </Col>
              <Col sm="3">
                <h5 className="text-label">Payer</h5>
                <p>{payer.name}</p>
              </Col>
            </Row>
          </CardBlock>
        </Card>
        <Footer />
      </div>
    );
  }
  return null;
}

export default observer(AuthorizationsResponse);
