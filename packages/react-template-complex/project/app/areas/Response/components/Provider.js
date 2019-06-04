import React from 'react';
import { Card, CardTitle,CardBody, Row, Collapse, Button } from 'reactstrap';
import classnames from 'classnames';
import { useToggle } from '@availity/hooks';
import ResponseField from './ResponseField';

export default () => {
  const [collapsed,toggleCollapse] = useToggle(false);

  return(
    <Card body className="mb-3">
      <CardTitle className="card-title-secondary">Provider Information</CardTitle>
      <Row>
        <ResponseField label="Requesting Provider" value="Rodriguez, Brandon" sm="3" />
        <ResponseField label="Referred-To-Provider" value="Riviera, Nick" sm="3" />
      </Row>

      <Card className="card-collapsible">
        <h5 className="card-header">
          {' '}
          <Button className={classnames({
            "card-collapsible-link":true,
            "collapsed":!collapsed
          })} color="link" onClick={() => toggleCollapse()}>
            View more data
          </Button>
        </h5>

        <Collapse isOpen={collapsed}>
          <CardBody>
            <p>
              Aut explicabo quas nihil quia ex aspernatur quod sint. Ut blanditiis itaque ab blanditiis et aut amet. Saepe
              voluptatem exercitationem tenetur necessitatibus. Amet debitis cupiditate sunt distinctio saepe nostrum
              laboriosam omnis.
            </p>
            <p>
              Natus voluptatem natus impedit. Facere voluptatem voluptas velit vel. Qui id reprehenderit beatae ea et sit
              blanditiis excepturi.
            </p>
          </CardBody>
        </Collapse>
      </Card>
    </Card>
  );
}
