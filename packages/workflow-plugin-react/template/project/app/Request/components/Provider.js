import React from 'react';
import { observer, inject } from 'mobx-react';
import { Label, UncontrolledTooltip } from 'reactstrap';
import { AvField } from 'availity-reactstrap-validation';
import propTypes from './props';

const Provider = inject('stateStore', 'appStore')(
  observer(props => {
    const { organizations, providers, npi } = props.stateStore.form;
    const { isProviderDisabled, onSelectedOrganization, onSelectedProvider, setProverNpi } = props.appStore;

    return (
      <fieldset>
        <legend>Provider</legend>

        <AvField
          type="select"
          name="organizations"
          label="Organization"
          onChange={onSelectedOrganization}
          required
          errorMessage="Please select an organization"
        >
          <option disabled value="">
            Select Organization
          </option>
          {organizations.map(org => (
            <option value={org.id} key={org.id}>
              {org.name}
            </option>
          ))}
        </AvField>

        <AvField
          type="select"
          name="providers"
          label="Provider"
          onChange={onSelectedProvider}
          disabled={isProviderDisabled}
          required
          errorMessage="Please select a provider"
          placeholder="Select a provider"
        >
          <option disabled value="">
            Select Provider
          </option>
          {providers.map(provider => (
            <option value={provider.id} key={provider.id}>
              {provider.name}
            </option>
          ))}
        </AvField>

        <Label id="npi-help" for="npi">
          NPI
          <span className="inline-help">What&apos;s this?</span>
        </Label>
        <UncontrolledTooltip target="npi-help" placement="top">
          National Provider Index
        </UncontrolledTooltip>

        <AvField
          type="text"
          id="npi"
          name="npi"
          value={npi}
          onChange={setProverNpi}
          validate={{
            npi: { value: true, errorMessage: 'NPI must be a valid format' },
            required: { value: true, errorMessage: 'NPI is required' }
          }}
        />
      </fieldset>
    );
  })
);

Provider.propTypes = propTypes;

export default Provider;
