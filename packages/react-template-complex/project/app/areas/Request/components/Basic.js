import React from 'react';
import { Card, CardTitle } from 'reactstrap';
import { AvSelectField } from '@availity/reactstrap-validation-select';
import { AvOrganizationSelect } from '@availity/reactstrap-validation-select/resources';
import { requiredValidation } from '../../../shared';

export default () => (
  <Card body className="mb-3">
    <CardTitle className="card-title-secondary">Basic Information</CardTitle>
    <AvSelectField
      name="payer"
      label="Payer"
      options={[{ label: 'Option 1', value: 1 }, { label: 'Option 2', value: 2 }, { label: 'Option 3', value: 3 }]}
      validate={requiredValidation}
    />
    <AvSelectField
      name="transactionType"
      label="Transaction Type"
      options={[{ label: 'Option 1', value: 1 }, { label: 'Option 2', value: 2 }, { label: 'Option 3', value: 3 }]}
      validate={requiredValidation}
    />
    <AvOrganizationSelect name="organization" label="Organization" required validate={requiredValidation} />
  </Card>
);
