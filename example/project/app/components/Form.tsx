import * as React from 'react';
import { Field } from '@availity/form';
import { Form as RForm, CardHeader, CardBody, CardFooter, Button } from 'reactstrap';
import config from './form-config.json';

const Form = ({
  handleSubmit,
  handleReset,
}: {
  handleSubmit?: React.FormEventHandler<HTMLFormElement>;
  handleReset?: React.MouseEventHandler<HTMLButtonElement>;
}) => (
  <RForm onSubmit={handleSubmit}>
    <CardHeader className="text-center h4 lead" tag="h3">
      {config.header}
    </CardHeader>
    <CardBody>
      {config.fields.map((fieldProps) => (
        <Field key={fieldProps.name} {...fieldProps} />
      ))}
    </CardBody>
    <CardFooter className="d-flex justify-content-end">
      <Button color="secondary" onClick={handleReset}>
        Reset
      </Button>
      <Button type="submit" color="primary" className="ml-2">
        Submit
      </Button>
    </CardFooter>
  </RForm>
);

export default Form;
