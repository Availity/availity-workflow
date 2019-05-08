import React from 'react';
import { observer } from 'mobx-react-lite';
import { AvProviderSelect, AvOrganizationSelect } from '@availity/reactstrap-validation-select/resources';
import { useStateStore, useAppStore } from '../../stores';

export default observer(() => {
  const {
    request: { organization, provider },
  } = useStateStore();
  const { setSelectValue, isProviderDisabled } = useAppStore();
  const { customerId } = organization;

  return (
    <fieldset>
      <legend>Provider</legend>

      <AvOrganizationSelect
        name="request.organization"
        label="Select a Organization"
        value={organization}
        onChange={e => setSelectValue(e, 'request.organization')}
        required
      />

      <AvProviderSelect
        name="request.provider"
        customerId={customerId}
        value={provider}
        requiredParams={['customerId']}
        watchParams={['customerId']}
        onChange={e => setSelectValue(e, 'request.provider')}
        label="Select a provider"
        isDisabled={isProviderDisabled}
        required
      />
    </fieldset>
  );
});
