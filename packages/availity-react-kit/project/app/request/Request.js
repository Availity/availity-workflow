import React from 'react';
import { Card, CardText, CardBlock,
  CardTitle, CardSubtitle, Button } from 'reactstrap';

const Request = () => {
  return (
    <div>
      <Card>
        <CardBlock>
          <CardTitle>Card title</CardTitle>
          <CardSubtitle>Card subtitle</CardSubtitle>
          <CardText>Some quick example text to build on the card title and make up the bulk of the card's content.</CardText>
          <Button>Button</Button>
        </CardBlock>
      </Card>
    </div>
  );
};

export default Request;
