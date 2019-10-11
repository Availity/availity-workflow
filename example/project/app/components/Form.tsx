import * as React from 'react';
import { Field } from '@availity/form';
import { Form as RForm, CardHeader, CardBody, CardFooter, Button } from 'reactstrap';
import { FormikProps } from 'formik';
import { FormValues } from '../form';

const Form: React.SFC<FormikProps<FormValues>> = ({ handleSubmit, handleReset }) => (
  <RForm onSubmit={handleSubmit}>
    <CardHeader className="text-center h4 lead" tag="h3">
      Test Card Header
    </CardHeader>
    <CardBody>
      <Field name="formField" label="Some Field Label" />
    </CardBody>
    <CardFooter className="d-flex justify-content-end">
      <Button color="secondary" onClick={handleReset}>
        Reset
      </Button>
      <Button color="primary" className="ml-2">
        Submit
      </Button>
    </CardFooter>
  </RForm>
);

export default Form;
