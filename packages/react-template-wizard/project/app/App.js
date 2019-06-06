import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, Route } from 'react-router-dom';
import { Container, Card } from 'reactstrap';
import Spaces from '@availity/spaces';
import PageHeader from '@availity/page-header';
import Wizard, { WizardStep, WizardStepTitle, WizardStepBadge } from '@availity/step-wizard';
import qs from 'query-string';
import get from 'lodash.get';
import { Search, Results } from './areas';

const App = ({ location, history }) => {
  const spaceId = get(qs.parse(location.search), 'spaceId');

  return (
    <Spaces spaceIds={[spaceId]} clientId="test">
      <Container data-testid="app-container">
        <PageHeader appName="Claims Status Listing" spaceId={spaceId} feedback/>
        <Card body>
          <Wizard bar>
            <WizardStep
              clickable={location.pathname !== '/'}
              complete={location.pathname === '/search'}
              active={location.pathname === '/'}
              onClick={() => history.push(`/?spaceId=${spaceId}`)}
            >
              <WizardStepBadge>1</WizardStepBadge>

              <WizardStepTitle>Search Claims</WizardStepTitle>
            </WizardStep>
            <WizardStep
              active={location.pathname === '/search'}
            >
              <WizardStepBadge>2</WizardStepBadge>
              <WizardStepTitle>Search Results</WizardStepTitle>
            </WizardStep>
          </Wizard>
          <Route exact path="/" component={Search} />
          <Route path="/search" component={Results} />
        </Card>
      </Container>
    </Spaces>
  );
};

App.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object
};

export default withRouter(App);
