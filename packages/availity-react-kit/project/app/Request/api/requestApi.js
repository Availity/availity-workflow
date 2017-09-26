import { defaults, get } from 'axios';
import map from 'lodash.map';

const ORGANIZATIONS_OPTS = '/api/sdk/platform/v1/organizations';
const PROVIDERS_OPTS = '/api/internal/v1/providers';
const USER_OPTS = '/api/sdk/platform/v1/users/me';
const AUTHORIZATIONS_OPTS = '/api/v1/proxy/healthplan/v1/authorizations';

export const getUser = () => get(USER_OPTS);

export const getOrganizations = (userId) => {
  return get(ORGANIZATIONS_OPTS, {
    params: {
      userId
    },
    transformResponse: defaults.transformResponse.concat(data => {
      const organizations = map(data.organizations, org => {
        return {
          id: org.id,
          name: org.name,
          customerId: org.customerId
        };
      });

      return { organizations };
    })
  });
};

export const getProviders = (customerId) => {
  return get(PROVIDERS_OPTS, {
    params: {
      customerId
    },
    transformResponse: defaults.transformResponse.concat(data => {
      const providers = map(data.providers, provider => {
        return {
          id: provider.id,
          businessName: provider.businessName,
          lastName: provider.lastName,
          firstName: provider.firstName,
          npi: provider.npi
        };
      });

      return { providers };
    })
  });
};

export const getAuthorization = (params) => {
  return get(AUTHORIZATIONS_OPTS, {
    params,
    transformResponse: defaults.transformResponse.concat(data => {
      const response = {
        customerId: data.customerId,
        certificationNumber: data.certificationNumber,
        patient: data.patient,
        subscriber: data.subscriber,
        status: data.status,
        diagnoses: data.diagnoses,
        requestType: data.requestType,
        payer: data.payer
      };

      return { response };
    })
  });
};
