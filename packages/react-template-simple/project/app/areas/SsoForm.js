import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col, Button } from 'reactstrap';
import PageHeader from '@availity/page-header';
import Spaces from '@availity/spaces';
import { AvForm } from 'availity-reactstrap-validation';
import { AvOrganizationSelect, AvProviderSelect } from '@availity/reactstrap-validation-select/resources';
import qs from 'query-string';
import Agreement from '../components/Agreement';

const getQueryString = pathname => pathname.substring(pathname.lastIndexOf('?'), pathname.length);

const SsoForm = ({ location }) => {
  const queryParams = qs.parse(getQueryString(location.pathname));
  const [customerId, setCustomerId] = useState(null);

  const onCancel = () => window.history.back();

  return (
    <Container data-testid="sso-container">
      <Spaces spaceIds={[queryParams.spaceId]} clientId="test">
        <PageHeader appName="Single Sign-On" spaceId={queryParams.spaceId} />
        <AvForm
          onValidSubmit={() => {
            // eslint-disable-next-line no-undef
            alert('SSO into Third Party App');
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
      </Spaces>
    </Container>
  );
};

SsoForm.propTypes = {
  location: PropTypes.object,
};

export default SsoForm;
