import { action, computed } from 'mobx';
import { organizationsApi, providersApi } from '@availity/api-axios';

const valueFromEvent = event => {
  if (event && event.target && typeof event.target.value !== 'undefined') {
    return event.target.value
  }
  return event;
}

class AppStore {
  constructor(state) {
    this.state = state;
  }

  async getOrganizations() {
    const response = await organizationsApi.getOrganizations();
    this.setOrganizations(response.data.organizations);
  }

  @action
  setOrganizations = event => {
    this.state.form.organizations = valueFromEvent(event);;
  }

  @action
  setSelectedOrganization = event => {
    this.state.form.selectedOrganization = valueFromEvent(event);;
  }

  @action
  onSelectedOrganization = event => {
    const id = valueFromEvent(event);
    this.state.form.organizations.forEach(org => {
      if (org.id === id) {
        this.state.form.selectedOrganization = org;
      }
    });
    this.getProviders(this.state.form.selectedOrganization.customerId);
  }

  async getProviders(customerId) {
    const response = await providersApi.getProviders(customerId);
    const providers = response.data.providers || [];

    // Normalize some attributes for UI
    providers.forEach(provider => {
      provider.name = provider.businessName || `${provider.lastName}, ${provider.firstName}`;
    });
    this.setProviders(providers);
  }

  @action
  setProviders = event => {
    this.state.form.providers = valueFromEvent(event);
  }

  @action
  onSelectedProvider = event => {
    const id = valueFromEvent(event);
    this.state.form.providers.forEach(provider => {
      if (provider.id === id) {
        this.state.form.selectedProvider = provider;
        this.setProverNpi(provider.npi);
      }
    });
  }

  @computed
  get isProviderDisabled() {
    return this.state.form.selectedOrganization === null;
  }

  @action
  setMemberId = event => {
    this.state.form.memberId = valueFromEvent(event);
  }

  @action
  setProverNpi = event => {
    this.state.form.npi = valueFromEvent(event);
  }

  @action
  setPageTitle(title) {
    this.state.page.title = title;
  }

  @action
  toggleAcceptedAgreement = () => {
    this.state.form.acceptTerms = this.state.form.acceptTerms;
  };
}

export default AppStore;
