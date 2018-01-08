import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { AvField } from 'availity-mobx-reactstrap-validation';
import { Label, UncontrolledTooltip } from 'reactstrap';
import propTypes from './props';

@inject('stateStore', 'appStore')
@observer
export default class Patient extends Component {
  static propTypes = propTypes;

  onMemberId = event => {
    const { value } = event.target;
    const { appStore } = this.props;
    appStore.setMemberId(value);
  };

  render() {
    const { memberId } = this.props.stateStore.form;
    return (
      <fieldset>
        <legend>Member</legend>

        <Label id="memberid-help" for="memberID">
          Member ID
          <span className="inline-help">What&apos;s this?</span>
        </Label>
        <UncontrolledTooltip target="memberid-help" placement="top">
          Also known as subscriber ID or member number
        </UncontrolledTooltip>

        <AvField
          type="number"
          id="memberID"
          name="memberID"
          value={memberId}
          onChange={this.onMemberId}
          validate={{
            number: { value: true, errorMessage: 'Must be a number' },
            minLength: { value: 5, errorMessage: '5 Character Minimum' }
          }}
        />

        <AvField
          type="date"
          id="dob"
          name="dob"
          label="Date of Birth"
          validate={{ date: { format: 'MM/DD/YYYY' } }}
          errorMessage="Date of birth format should be MM/DD/YYYY"
        />
      </fieldset>
    );
  }
}
