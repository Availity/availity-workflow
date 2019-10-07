import React from 'react';
import { Formik } from 'formik';
import { Field } from '@availity/form';
import PageHeader from '@availity/page-header';
import { Container, Card, CardBody, CardHeader, CardFooter, Button, Form } from 'reactstrap';
import * as yup from 'yup';

export default () => (
  <Container className="container-sm">
    <PageHeader appName="Sample Project" appAbbr="SP" feedback />
    <Card
      tag={Formik}
      initialValues={{
        formField: '',
      }}
      validationSchema={yup.object().shape({
        formField: yup.string().required('This field is required.'),
      })}
      render={({ handleSubmit, handleReset }) => (
        <Form onSubmit={handleSubmit}>
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
        </Form>
      )}
    />
  </Container>
);
