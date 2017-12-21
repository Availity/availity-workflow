import { userApi, organizationsApi, providersApi, ProxyApi } from '@availity/api-axios';
import map from 'lodash.map';

const getUserApi = () => userApi.me();

const getOrganizationsApi = async () => {
  const response = await organizationsApi.getOrganizations();
  const organizations = map(response.data.organizations, org => ({
    id: org.id,
    name: org.name,
    customerId: org.customerId
  }));
  return organizations;
};

const getProvidersApi = async customerId => {
  const response = await providersApi.getProviders(customerId);
  const providers = map(response.data.providers, provider => ({
    id: provider.id,
    businessName: provider.businessName,
    lastName: provider.lastName,
    firstName: provider.firstName,
    npi: provider.npi
  }));

  return providers;
};

const healthPlanAuthorizations = new ProxyApi({
  tenant: 'healthplan',
  name: 'authorizations'
});

const getAuthorizationApi = async () => {
  const response = await healthPlanAuthorizations.query();

  const authorizations = map(response.data, provider => ({
    customerId: provider.customerId,
    certificationNumber: provider.certificationNumber,
    patient: provider.patient,
    subscriber: provider.subscriber,
    status: provider.status,
    diagnoses: provider.diagnoses,
    requestType: provider.requestType,
    payer: provider.payer
  }));

  return authorizations;
};

export { getAuthorizationApi, getUserApi, getOrganizationsApi, getProvidersApi };
