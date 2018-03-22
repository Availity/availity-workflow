import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import get from 'lodash.get';
import { Label, UncontrolledTooltip } from 'reactstrap';
import { AvField } from 'availity-reactstrap-validation';
import propTypes from './props';

@inject('stateStore', 'appStore')
@observer
export default class Provider extends Component {
  static propTypes = propTypes;

  onSelectedOrganization = event => {
    const { value } = event.target;
    const { appStore } = this.props;
    appStore.onSelectedOrganization(value);
  };

  onSelectedProvider = event => {
    const { value } = event.target;
    const { appStore } = this.props;
    appStore.onSelectedProvider(value);
  };

  onNpiChange = () => {};

  render() {
    const { organizations, providers } = this.props.stateStore.form;

    const { isProviderDisabled } = this.props.appStore;

    return (
      <fieldset>
        <legend>Provider</legend>

        <AvField
          type="select"
          id="organizations"
          name="organizations"
          label="Organization"
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
          onChange={this.onSelectedProvider}
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
          value={get('selectedProvider.npi')}
          validate={{
            npi: { value: true, errorMessage: 'NPI must be a valid format' },
            required: { value: true, errorMessage: 'NPI is required' }
          }}
        />
      </fieldset>
    );
  }
}
