import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';
import { AvForm } from 'availity-mobx-reactstrap-validation';
import { Button, Card, CardBody } from 'reactstrap';
// import BlockUi from 'react-block-ui';

import { Agreement, Patient, Provider } from './components';
import { Footer, Header } from '../components';

@inject('appStore')
@observer
export default class AuthorizationsRequest extends Component {
  static propTypes = {
    appStore: PropTypes.shape({
      state: PropTypes.any
    })
  };

  componentDidMount() {
    const { appStore } = this.props;
    appStore.getOrganizations();
  }

  submit = async () => {};

  render() {
    return (
      <div className="container-sm">
        <Header />
        <AvForm onValidSubmit={this.submit}>
          <Card>
            <CardBody>
              <Provider />
              <Patient />
              <Agreement />
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
