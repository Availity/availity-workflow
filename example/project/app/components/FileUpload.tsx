import { Card, CardHeader, CardContent, FileSelector2, FormProvider, useForm } from '@availity/element';

export function FileUpload() {
  const methods = useForm({
    defaultValues: {
      'my-file-upload': [] as File[],
    },
  });

  return (
    <Card>
      <CardHeader title="File Upload Example" />
      <CardContent>
        <FormProvider {...methods}>
          <FileSelector2
            name="my-file-upload"
            clientId="example-client-id"
            customerId="example-customer-id"
            bucketId="example-bucket-id"
            allowedFileTypes={['.pdf', '.png', '.txt']}
            maxFiles={3}
            maxSize={5 * 1024 * 1024}
            enableDropArea
            multiple
          />
        </FormProvider>
      </CardContent>
    </Card>
  );
}
