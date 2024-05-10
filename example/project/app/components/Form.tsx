import { useState } from 'react';
import BlockUi from '@availity/block-ui';
import { Form, Field } from '@availity/form';
import { Alert, Button, CardBody, CardFooter, CardHeader } from 'reactstrap';
import { object, string } from 'yup';

import { chain, nullChain } from '@/chain';

import config from './form-config.json';

const initialValues = {
  formField: '',
  chainedField: chain,
  nullishCoalescedField: nullChain,
};

const schema = object().shape({
  formField: string().required('This field is required.'),
  chainedField: string().required('This field is required.'),
  nullishCoalescedField: string().required('This field is required.'),
});

async function sleep(duration = 2500) {
  await new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
}

export function SearchForm() {
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleOnSubmit = async () => {
    setLoading(true);
    await sleep();
    setLoading(false);
    setIsSubmitted(true);
  };

  return (
    <Form onSubmit={handleOnSubmit} initialValues={initialValues} validationSchema={schema}>
      <CardHeader className="h4" tag="h3">
        {config.header}
      </CardHeader>
      <BlockUi tag={CardBody} blocking={loading}>
        <Alert isOpen={isSubmitted} toggle={() => setIsSubmitted(false)} color="success">
          Form submitted!
        </Alert>
        {config.fields.map((fieldProps) => (
          <Field key={fieldProps.name} {...fieldProps} />
        ))}
      </BlockUi>
      <CardFooter className="d-flex justify-content-end">
        <Button color="secondary" type="reset">
          Reset
        </Button>
        <Button type="submit" color="primary" className="ml-2">
          Submit
        </Button>
      </CardFooter>
    </Form>
  );
}
