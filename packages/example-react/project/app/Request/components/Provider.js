import React from 'react';
import { observer, inject } from 'mobx-react';
import { AvProviderSelect, AvOrganizationSelect } from '@availity/reactstrap-validation-select/resources';
import propTypes from './props';

const Provider = ({ stateStore: { request }, appStore }) => {
  const { organization, provider } = request;
  const { customerId } = organization;
  return (
    <fieldset>
      <legend>Provider</legend>

      <AvOrganizationSelect
        name="request.organization"
        label="Select a Organization"
        value={organization}
        onChange={e => appStore.setSelectValue(e, 'request.organization')}
        required
      />

      <AvProviderSelect
        name="request.provider"
        customerId={customerId}
        value={provider}
        requiredParams={['customerId']}
        watchParams={['customerId']}
        onChange={e => appStore.setSelectValue(e, 'request.provider')}
        label="Select a provider"
        isDisabled={appStore.isProviderDisabled}
        required
      />
    </fieldset>
  );
};

Provider.propTypes = propTypes;

export default inject('stateStore', 'appStore')(observer(Provider));
