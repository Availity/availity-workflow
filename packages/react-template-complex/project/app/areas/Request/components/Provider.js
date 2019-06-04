import React, { useState, useCallback } from 'react';
import { Card, CardTitle, Row, Col, Label,Button } from 'reactstrap';
import { AvRadioGroup, AvRadio, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { AvSelectField } from '@availity/reactstrap-validation-select';
import Icon from '@availity/icon';
import { AvDateField } from '@availity/reactstrap-validation-date';
import { requiredValidation } from '../../../shared';

export default () => {
  const [codeCount, setCodeCount] = useState(1);

  const increment = () => setCodeCount(codeCount + 1);

  const createCodeInputs = useCallback(() => {
    let diagnosisCodes = [];
    for (let i = 0; i < codeCount; i++) {
      diagnosisCodes.push(
        <Row key={i}>
          <Col xs={12} md={6} sm={6}>
            <AvField name={`code-${i}`} label="Code" type="text" />
          </Col>
          <Col xs={12} md={6} sm={6}>
            <AvDateField name={`datetime-${i}`} label="Date" />
          </Col>
        </Row>
      );
    }
    return diagnosisCodes;
  }, [codeCount]);

  return (
    <Card body className="mb-3">
      <CardTitle className="card-title-secondary">Requesting Provider Information</CardTitle>
      <AvRadioGroup name="providerType" label={<Label>Requesting Provider Type</Label>} validate={requiredValidation}>
        <AvRadio label="Provider" value="provider" />
        <AvRadio label="Front Office (5 users)" value="frontOffice" />
      </AvRadioGroup>
      <AvSelectField
        name="requestProvider"
        label="Express Entry - Requesting Provider"
        options={[{ label: 'Option 1', value: 1 }, { label: 'Option 2', value: 2 }, { label: 'Option 3', value: 3 }]}
        validate={requiredValidation}
      />
      <AvGroup>
        <Label>Zipcode</Label>
        <Row>
          <Col xs={7}>
            <AvInput name="zip" />
          </Col>
          <Col xs={5}>
            <AvInput name="zipext" />
          </Col>
        </Row>
      </AvGroup>

      <Card body className="card-default">
        <p>
          <strong>Diagnosis Code(s)</strong>
        </p>
        {createCodeInputs()}
      </Card>
      {codeCount < 3 && <Button color="link" className="d-flex align-items-center ml-0 pl-0"onClick={increment}><Icon name="plus-circle" />Add another code</Button>}
    </Card>
  );
};
