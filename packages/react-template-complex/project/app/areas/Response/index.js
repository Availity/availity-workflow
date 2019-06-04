import React from 'react';
import PageHeader from '@availity/page-header';
import { Container } from 'reactstrap';
import { Transaction, Certification, Provider, Service, AdditionalService, Contact } from './components';

export default ({ spaceId }) => (
  <Container>
    <PageHeader appAbbr="AR" path="/" appName="Authorization Response" spaceId={spaceId} />
    <Transaction />
    <Certification />
    <Provider />
    <Service />
    <AdditionalService />
    <Contact />
  </Container>
);
