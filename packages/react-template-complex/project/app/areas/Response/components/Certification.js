import React, { Fragment } from 'react';
import { Card, CardTitle } from 'reactstrap';
import ResponseField from './ResponseField';

export default () => (
  <Card className="mb-3" body>
    <CardTitle className="card-title-secondary">Certification Information</CardTitle>
    <ResponseField tag={Fragment} label="Certification Number" value="123456789" />
    <ResponseField tag={Fragment} label="Status" value="Modified" />
    <ResponseField
      tag={Fragment}
      label="Message"
      value="Quae quis sequi veniam non. Qui possimus commodi fuga commodi accusamus quo ad repellat optio. Non rerum ut
    blanditiis. Sint fuga est commodi ratione accusamus. Ad veniam pariatur natus in aut natus sunt et nihil."
    />
  </Card>
);
