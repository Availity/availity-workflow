import { action, computed } from 'mobx';
import { organizationsApi, providersApi } from '@availity/api-axios';

class AppStore {
  constructor(state) {
    this.state = state;
  }

  async getOrganizations() {
    const response = await organizationsApi.getOrganizations();
    this.setOrganizations(response.data.organizations);
  }

  @action
  setOrganizations(orgs) {
    this.state.form.organizations = orgs;
  }

  @action
  setSelectedOrganization(organization) {
    this.state.form.selectedOrganization = organization;
  }

  @action
  onSelectedOrganization(id) {
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
  setProviders(providers) {
    this.state.form.providers = providers;
  }

  @action
  onSelectedProvider(id) {
    this.state.form.providers.forEach(provider => {
      if (provider.id === id) {
        this.state.form.selectedProvider = provider;
      }
    });
  }

  @computed
  get isProviderDisabled() {
    return this.state.form.selectedOrganization === null;
  }

  @action
  setMemberId(id) {
    this.state.form.memberId = id;
  }

  @action
  setPageTitle(title) {
    this.state.page.title = title;
  }

  @action
  toggleAcceptedAgreement() {
    this.state.form.acceptTerms = this.state.form.acceptTerms;
  }
}

export default AppStore;
