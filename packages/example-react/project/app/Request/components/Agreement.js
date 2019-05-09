import React from 'react';
import { observer, inject } from 'mobx-react';
import { AvFeedback, AvInput, AvGroup } from 'availity-reactstrap-validation';
import { Label } from 'reactstrap';
import props from './props';

const Agreement = ({ appStore, stateStore }) => {
  const { acceptTerms } = stateStore;
  return (
    <fieldset>
      <div className="disclaimer">
        I have fully read this agreement and understand that I am entering into a legally binding agreement and that my
        organization is bound by the terms and conditions contained therein. I attest and certify that I am the Primary
        Controlling Authority for the organization named herein and that I possess the necessary legal authority to bind
        this organization. I further attest and certify my organization&apos;s designation as a Covered Entity under{' '}
        <abbr title="Health Insurance Portability and Accountability Act">HIPAA</abbr>.
      </div>

      <AvGroup check className="custom-control custom-checkbox">
        <AvInput
          id="agreement"
          name="request.acceptTerms"
          type="checkbox"
          className="custom-control-input"
          checked={acceptTerms}
          onChange={appStore.toggle}
          required
        />
        <Label for="agreement" className="custom-control-label" check>
          I agree to the terms and conditions
        </Label>
        <AvFeedback>You must agree to terms</AvFeedback>
      </AvGroup>
    </fieldset>
  );
};

Agreement.propTypes = props;

export default inject('appStore', 'stateStore')(observer(Agreement));
