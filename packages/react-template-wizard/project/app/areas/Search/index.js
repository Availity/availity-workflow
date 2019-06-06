import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Button } from 'reactstrap';
import { withRouter } from 'react-router-dom';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { AvSelectField } from '@availity/reactstrap-validation-select';
import { AvOrganizationSelect, AvProviderSelect } from '@availity/reactstrap-validation-select/resources';
import { AvDateField } from '@availity/reactstrap-validation-date';
import qs from 'query-string';

const Search = ({ history, location }) => {
  const [taxIds, setTaxIds] = useState([]);
  const [customerId, setCustomerId] = useState(null);

  const updateNpis = newTaxIds =>
    setTaxIds(
      newTaxIds.map(taxId => ({
        label: taxId.number,
        value: taxId,
      }))
    );

  const updateFormValues = org => {
    updateNpis(org.taxIds);
    setCustomerId(org.customerId);
  };

  const searchClaims = () => {
    const queryParams = {
      ...qs.parse(location.search)
    }

    history.push(`/search?${qs.stringify(queryParams)}`)
  }

  return (
    <AvForm onValidSubmit={searchClaims}>
      <AvOrganizationSelect name="organization" label="Organization" onChange={e => updateFormValues(e)} />
      <AvSelectField name="taxId" label="Tax ID" options={taxIds} isDisabled={taxIds.length === 0} />
      <AvProviderSelect
        name="provider"
        label="Express Entry"
        customerId={customerId}
        isDisabled={customerId === null}
      />
      <AvField name="npi" label="NPI" />
      <Card body className="card-default mb-3">
        <p>
          <strong>Date of Service</strong>
        </p>
        <AvDateField name="serviceStartDate" label="Start Date:" />
        <AvDateField name="serviceEndDate" label="End Date:" />
      </Card>
      <Button color="primary" type="submit" className="float-right">Search</Button>
    </AvForm>
  );
};

Search.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object
}

export default withRouter(Search);
