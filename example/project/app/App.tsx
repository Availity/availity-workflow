import * as React from 'react';
import { Formik, FormikProps } from 'formik';
import PageHeader from '@availity/page-header';
import { Container, Card } from 'reactstrap';
import Form from '@/components/Form';
import * as yup from 'yup';
import { FormValues } from './form';

const App: React.SFC<{}> = () => (
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
      render={(formikProps: FormikProps<FormValues>) => (
        <Form {...formikProps} />
      )}
    />
  </Container>
);

export default App;
