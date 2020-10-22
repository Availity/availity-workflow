import React from 'react';
import { Formik } from 'formik';
import PageHeader from '@availity/page-header';
import { Container, Card } from 'reactstrap';
import { object, string } from 'yup';
import Form from '@/components/Form';
import { chain, nullChain } from '@/chain';

const App: React.SFC<Record<string, unknown>> = () => (
  <Container className="container-sm">
    <PageHeader appName="Sample Project" appAbbr="SP" feedback />
    <Card
      tag={Formik}
      initialValues={{
        formField: '',
        chainedField: chain,
        nullishCoalescedField: nullChain,
      }}
      // onSubmit={() => {}}
      validationSchema={object().shape({
        formField: string().required('This field is required.'),
        chainedField: string().required('This field is required.'),
        nullishCoalescedField: string().required('This field is required.'),
      })}
    >
      {Form}
    </Card>
  </Container>
);

export default App;
