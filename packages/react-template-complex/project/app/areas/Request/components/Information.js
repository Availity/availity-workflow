import React from 'react';
import { Card, CardTitle, Row, Col, Label } from 'reactstrap';
import { AvField, AvGroup, AvInput } from 'availity-reactstrap-validation';
import AvSelect, { AvSelectField } from '@availity/reactstrap-validation-select';
import { AvDateField } from '@availity/reactstrap-validation-date';
import { requiredValidation } from '../../../shared';

export default () => (
  <Card body className="mb-3">
    <CardTitle className="card-title-secondary">Request Information</CardTitle>
    <AvField name="memberId" label="Member ID" type="text" validate={requiredValidation} />
    <AvSelectField
      name="relationship"
      label="Relationship to Subscriber"
      options={[{ label: 'Option 1', value: 1 }, { label: 'Option 2', value: 2 }, { label: 'Option 3', value: 3 }]}
      validate={requiredValidation}
    />
    <AvDateField name="dob" label="Date of Birth" validate={requiredValidation} />
    <AvGroup>
      <Label>Service Quantity/Type</Label>
      <Row>
        <Col xs={4}>
          <AvInput type="text" name="serviceQualityType" />
        </Col>
        <Col xs={8}>
          <AvSelect
            name="rts"
            options={[
              { label: 'Option 1', value: 1 },
              { label: 'Option 2', value: 2 },
              { label: 'Option 3', value: 3 },
            ]}
          />
        </Col>
      </Row>
    </AvGroup>
  </Card>
);
