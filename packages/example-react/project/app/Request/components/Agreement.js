import React from 'react';
import { observer, inject } from 'mobx-react';
import { AvFeedback, AvInput, AvGroup } from 'availity-reactstrap-validation';
import { Label } from 'reactstrap';

const Agreement = inject('appStore')(
  observer(props => (
    <fieldset>
      <div className="disclaimer">
        I have fully read this agreement and understand that I am entering into a legally binding agreement and that my
        organization is bound by the terms and conditions contained therein. I attest and certify that I am the Primary
        Controlling Authority for the organization named herein and that I possess the necessary legal authority to bind
        this organization. I further attest and certify my organization&quote;s designation as a Covered Entity
        under <abbr title="Health Insurance Portability and Accountability Act">HIPAA</abbr>, as more fully described in 45 CFR § 160.103.
      </div>

      <AvGroup check>
        <AvInput
          id="agreement"
          name="agreement"
          type="checkbox"
          onChange={props.appStore.toggleAcceptedAgreement}
          required
        />
        <Label for="agreement" check>
          &nbsp;I agree to the terms and conditions
        </Label>
        <AvFeedback>You must agree to terms</AvFeedback>
      </AvGroup>
    </fieldset>
  ))
);

export default Agreement;
