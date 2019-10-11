import React from 'react';
import { Formik } from 'formik';
import PageHeader from '@availity/page-header';
import { Container, Card } from 'reactstrap';
import * as yup from 'yup';
import Form from '@/components/Form';

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
      render={Form}
    />
  </Container>
);

export default App;
