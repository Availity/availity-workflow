import { action, computed, observable } from 'mobx';
import { getProviders, getOrganizations, getUser } from '../api/requestApi';
import map from 'lodash.map';

export class Organization {
  @observable id
  @observable name
  @observable customerId

  constructor(json) {
    const _json = json || {};

    this.id = _json.id || '';
    this.name = _json.name || '';
    this.customerId = _json.customerId || '';
  }
}

export class Provider {
  @observable id
  @observable businessName
  @observable lastName
  @observable firstName
  @observable npi

  constructor(json) {
    const _json = json || {};

    this.id = _json.id || '';
    this.businessName = _json.businessName || '';
    this.lastName = _json.lastName || '';
    this.firstName = _json.firstName || '';
    this.npi = _json.npi || '';
  }
}

export class RequestStore {
  @observable userId = '';
  @observable memberId = '';
  @observable selectedOrganization = '';
  @observable selectedProvider = '';
  @observable organizations = [];
  @observable providers = [];
  @observable npi = '';
  @observable dob = '';
  @observable relationshipToSubscriber = '';
  @observable acceptedAgreement = false;

  @action getUser() {
    const self = this;
    return getUser()
      .then(resp => {
        self.userId = resp.data.id;
        getOrganizations(self.userId)
          .then(_resp => {
            const { organizations } = _resp.data;
            self.organizations = map(organizations, org => new Organization(org));
          });
      });
  }

  @action toggleAcceptedAgreement() {
    this.acceptedAgreement = !this.acceptedAgreement;
  }

  @action updateMemberId(id) {
    this.memberId = id;
  }

  @action onSelectedOrganization(orgId) {
    this.organizations.forEach(org => {
      if (org.id === orgId) {
        this.selectedOrganization = org;
      }
    });

    getProviders(this.selectedOrganization.customerId)
      .then(resp => {
        const { providers } = resp.data;
        this.providers = map(providers, provider => new Provider(provider));
      });
  }

  @action onSelectedProvider(providerId) {
    this.providers.forEach(provider => {
      if (provider.id === providerId) {
        this.selectedProvider = provider;
        this.npi = provider.npi;
      }
    });
  }

  @action updateNPI(npi) {
    this.npi = npi;
  }

  @computed get isProviderDisabled() {
    return this.selectedOrganization === null;
  }
}

export default new RequestStore();
