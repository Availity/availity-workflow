import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { AvForm } from 'availity-mobx-reactstrap-validation';
import { Button, Card, CardBody } from 'reactstrap';

import requestStore from './stores/requestStore';
import { getAuthorization } from './api/requestApi';
import uiStore from '../stores/uiStore';
import { Agreement, Patient, Provider } from './components';

import { Footer, Header } from '../components';

@observer
export default class AuthorizationsRequest extends Component {
  componentWillMount() {
    requestStore.getUser();
  }

  submit = async () => {
    const params = {
      dob: requestStore.dob,
      memberId: requestStore.memberId,
      npi: requestStore.npi
    };

    const response = await getAuthorization(params);
    uiStore.setCurrentResponse(response);
  };

  render() {
    return (
      <div className="container-sm">
        <Header />
        <AvForm onValidSubmit={this.submit}>
          <Card>
            <CardBody>
              <Provider requestStore={requestStore} />
              <Patient requestStore={requestStore} />
              <Agreement requestStore={requestStore} />
              <hr className="divider" />
              <div className="form-controls form-controls-card">
                <Button type="submit" className="btn btn-default">
                  Authorize
                </Button>
              </div>
            </CardBody>
          </Card>
        </AvForm>
        <Footer />
      </div>
    );
  }
}
