import React, { useState } from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import get from 'lodash.get';
import PageHeader from '@availity/page-header';
import { AvForm } from 'availity-reactstrap-validation';
import { AvOrganizationSelect, AvProviderSelect } from '@availity/reactstrap-validation-select/resources';
import Agreement from '../components/Agreement';
import useSpace from '../hooks/useSpace';

export default () => {
  const [customerId, setCustomerId] = useState(null);
  const [space, loading] = useSpace("48C607A70B5A46A3864A34E2BDDDEA04");

  const onCancel = () => window.history.back();

  console.log('Space:', space);

  return (
    <Container>
      <PageHeader appName="Single Sign-On" spaceId="48C607A70B5A46A3864A34E2BDDDEA04" spaceName={get(space, 'name')} />
      <AvForm
        onValidSubmit={() => {
          console.log('valid submit');
        }}
      >
        <AvOrganizationSelect
          label="Select and Organization"
          onChange={e => setCustomerId(e.customerId)}
          name="organization"
          validate={{ required: { value: true, errorMessage: 'This field is required' } }}
        />
        <AvProviderSelect
          label="Select your Provider"
          name="provider"
          customerId={customerId}
          requiredParams={['customerId']}
          resetParams={['customerId']}
          watchParams={['customerId']}
          validate={{ required: { value: true, errorMessage: 'This field is required' } }}
        />
        <Agreement />
        <Row className="form-controls">
          <Col sm={6}>
            <Button id="cancel-button" onClick={onCancel} color="default" block>
              Cancel
            </Button>
          </Col>
          <Col sm={6}>
            <Button id="submit-button" aria-describedby="sso-desc" type="submit" color="success" block>
              Submit
            </Button>
          </Col>
        </Row>
        <aside className="sr-only" id="sso-desc">
          Signing in will redirect you to your payer space in a new tab.
        </aside>
      </AvForm>
    </Container>
  );
};
