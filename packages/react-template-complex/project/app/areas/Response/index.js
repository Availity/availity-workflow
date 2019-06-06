import React from 'react';
import PropTypes from 'prop-types';
import PageHeader from '@availity/page-header';
import { Container } from 'reactstrap';
import { Transaction, Certification, Provider, Service, AdditionalService, Contact } from './components';

const Response = ({ spaceId }) => (
  <Container>
    <PageHeader path="/" appName="Authorization Response" spaceId={spaceId} />
    <Transaction />
    <Certification />
    <Provider />
    <Service />
    <AdditionalService />
    <Contact />
  </Container>
);

Response.propTypes = {
  spaceId: PropTypes.string
};

export default Response;
