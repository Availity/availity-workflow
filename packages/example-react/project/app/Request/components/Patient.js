import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { AvField } from 'availity-reactstrap-validation';
import { Label, UncontrolledTooltip } from 'reactstrap';
import { AvDateField } from '@availity/reactstrap-validation-date';
import { AppStore } from '~/stores';
import propTypes from './props';

const Patient = () => {
  const {
    request: { memberId },
    onChange,
  } = useContext(AppStore);
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
        name="memberID"
        value={memberId}
        onChange={onChange}
        validate={{
          pattern: { value: '^[0-9]*$', errorMessage: 'Must be a number' },
          minLength: { value: 5, errorMessage: '5 Character Minimum' },
        }}
      />

      <AvDateField name="dob" label="Date of Birth" validate={{ date: { format: 'MM/DD/YYYY' } }} required />
    </fieldset>
  );
};

Patient.propTypes = propTypes;

export default observer(Patient);
