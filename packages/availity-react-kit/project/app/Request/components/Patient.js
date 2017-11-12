import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { AvField } from 'availity-mobx-reactstrap-validation';
import { Label, UncontrolledTooltip } from 'reactstrap';
import PropTypes from 'prop-types';
import { RequestStore } from '../stores/requestStore';

@observer
export default class Patient extends Component {
  updateMemberId = event => {
    const { requestStore } = this.props;
    const { value } = event.target;

    requestStore.updateMemberId(value);
  };

  render() {
    const { dob, memberId } = this.props.requestStore;

    return (
      <fieldset>
        <legend>Member</legend>

        <Label id="memberid-help" for="memberID">
          Member ID
          <span className="inline-help">What's this?</span>
        </Label>
        <UncontrolledTooltip target="memberid-help" placement="top">
          Also known as subscriber ID or member number
        </UncontrolledTooltip>

        <AvField
          type="number"
          id="memberID"
          name="memberID"
          value={memberId}
          validate={{
            number: { value: true, errorMessage: 'Must be a number' },
            minLength: { value: 5, errorMessage: '5 Character Minimum' }
          }}
        />

        <AvField
          type="date"
          id="dob"
          name="dob"
          value={dob}
          label="Date of Birth"
          validate={{ date: { format: 'MM/DD/YYYY' } }}
          errorMessage="Date of birth format should be MM/DD/YYYY"
        />
      </fieldset>
    );
  }
}

Patient.propTypes = {
  requestStore: PropTypes.instanceOf(RequestStore).isRequired
};
