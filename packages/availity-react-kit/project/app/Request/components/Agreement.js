import React from 'react';
import { observer } from 'mobx-react';
import { AvFeedback, AvInput, AvGroup } from 'availity-mobx-reactstrap-validation';
import { Label } from 'reactstrap';
import PropTypes from 'prop-types';
import { RequestStore } from '../stores/requestStore';

function Agreement({ requestStore }) {
  const { acceptedAgreement } = requestStore;

  const toggleAcceptedAgreement = () => {
    requestStore.toggleAcceptedAgreement();
  };

  return (
    <fieldset>
      <div className="disclaimer">
        I have fully read this agreement and understand that I am entering into a legally binding agreement and that my organization is bound by the terms and conditions contained therein. I attest and certify that I am the Primary Controlling Authority for the organization named herein and that I possess the necessary legal authority to bind this organization. I further attest and certify my organization's designation as a Covered Entity under HIPAA, as more fully described in 45 CFR § 160.103.
      </div>

      <AvGroup>
        <Label className="pl-3" check inline>
          <AvInput
            id="agreement"
            name="agreement"
            type="checkbox"
            checked={acceptedAgreement}
            onChange={toggleAcceptedAgreement}
            required
          />
          &nbsp;I agree to the terms and conditions
        </Label>
        <AvFeedback>You must agree to terms</AvFeedback>
      </AvGroup>
    </fieldset>
  );
}

Agreement.propTypes = {
  requestStore: PropTypes.instanceOf(RequestStore).isRequired
};

export default observer(Agreement);
