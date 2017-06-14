import React from 'react';
import { Button, Card, CardText, CardTitle, CardSubtitle, Container } from 'reactstrap';

const Request = () => {
  return (
    <Container className="mt-2">
      <Card block>
        <CardTitle>Card title</CardTitle>
        <CardSubtitle>Card subtitle</CardSubtitle>
        <CardText>
          Some quick example text to build on the card title and make up the bulk of the card's content.
          We rely heavily on <a href="https://reactstrap.github.io/" target="_blank">reactstrap</a> to avoid manually applying bootstrap/UIKit classes to elements.
          <a href="https://reactstrap.github.io/components/" target="_blank">Check out all of the available components and their examples</a>
        </CardText>
        <div>
          <Button color="primary">Button</Button>
        </div>
      </Card>
    </Container>
  );
};

export default Request;
