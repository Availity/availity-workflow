import { useState } from 'react';
import {
  Alert,
  BlockUi,
  Button,
  CardActions,
  CardContent,
  CardHeader,
  Collapse,
  FormProvider,
  ControlledTextField,
  useForm,
} from '@availity/element';
import { yupResolver } from '@hookform/resolvers/yup';
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

  const methods = useForm({
    defaultValues: initialValues,
    mode: 'onBlur',
    resolver: yupResolver(schema),
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleOnSubmit)}>
        <CardHeader title={config.header} />
        <BlockUi blocking={loading}>
          <CardContent>
            <Collapse in={isSubmitted}>
              <Alert onClose={() => setIsSubmitted(false)} severity="success">
                Form submitted!
              </Alert>
            </Collapse>

            {config.fields.map((fieldProps) => (
              <ControlledTextField key={fieldProps.name} {...fieldProps} />
            ))}
          </CardContent>
        </BlockUi>
        <CardActions>
          <Button color="secondary" type="reset" onClick={() => methods.reset()}>
            Reset
          </Button>
          <Button type="submit" color="primary" className="ml-2">
            Submit
          </Button>
        </CardActions>
      </form>
    </FormProvider>
  );
}
