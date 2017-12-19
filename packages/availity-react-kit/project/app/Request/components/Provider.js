import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { Label, UncontrolledTooltip } from 'reactstrap';
import { AvField } from 'availity-mobx-reactstrap-validation';
import { RequestStore } from '../stores/requestStore';

@observer
export default class Provider extends Component {
  onSelectedOrganization = event => {
    const { requestStore } = this.props;
    const { value } = event.target;

    requestStore.onSelectedOrganization(value);
  };

  onSelectedProvider = event => {
    const { requestStore } = this.props;
    const { value } = event.target;

    requestStore.onSelectedProvider(value);
  };

  updateNPI = event => {
    const { requestStore } = this.props;
    const { value } = event.target;

    requestStore.updateNPI(value);
  };

  render() {
    const {
      selectedOrganization,
      organizations,
      selectedProvider,
      providers,
      isProviderDisabled,
      npi
    } = this.props.requestStore;

    return (
      <fieldset>
        <legend>Provider</legend>

        <AvField
          type="select"
          id="organizations"
          name="organizations"
          label="Organization"
          value={selectedOrganization.id}
          onChange={this.onSelectedOrganization}
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
          id="providers"
          name="providers"
          label="Provider"
          value={selectedProvider.id}
          disabled={isProviderDisabled}
          onChange={this.onSelectedProvider}
          required
          errorMessage="Please select a provider"
          placeholder="Select a provider"
        >
          <option disabled value="">
            Select Provider
          </option>
          {providers.map(provider => (
            <option value={provider.id} key={provider.id}>
              {provider.businessName || `${provider.firstName} ${provider.lastName}}`}
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
          onChange={this.updateNPI}
          validate={{
            npi: { value: true, errorMessage: 'NPI must be a valid format' },
            required: { value: true, errorMessage: 'NPI is required' }
          }}
        />
      </fieldset>
    );
  }
}

Provider.propTypes = {
  requestStore: PropTypes.instanceOf(RequestStore).isRequired
};
