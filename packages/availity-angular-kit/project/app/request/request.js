import app from 'app-module';
import { availity } from 'availity-angular';
import uiRouter from '@uirouter/angularjs';
import Upload from '@availity/upload-core';

class Request {
  constructor(avOrganizationsApi, avUsersApi, avProvidersApi, $state) {
    this.di = {
      avOrganizationsApi,
      avUsersApi,
      avProvidersApi,
      $state,
    };

    this.memberId = null;
    this.selectedOrganization = null;
    this.organizations = null;
    this.selectedProvider = null;
    this.providers = null;
    this.npi = null;
    this.dob = null;
    this.relationshipToSubscriber = null;
    this.acceptedAgreement = false;
    this.uploads = [];
  }

  init() {
    return this.getOrganizations();
  }

  getUser() {
    const self = this;

    return this.di.avUsersApi.me().then(user => {
      self.user = user;
      return user;
    });
  }

  onSelectedOrganization(organization) {
    this.isProviderDisabled = false;
    this.getProviders(organization);
  }

  onSelectedProvider(provider) {
    this.npi = provider.npi;
  }

  isProviderDisabled() {
    return this.selectedOrganization === null;
  }

  getOrganizations() {
    return this.di.avOrganizationsApi.getOrganizations().then(response => {
      const { organizations = [] } = response.data;
      this.organizations = organizations;
      return organizations;
    });
  }

  getProviders(organization) {
    const self = this;

    const { normalize } = this.di.avProvidersApi;

    return this.di.avProvidersApi
      .getProviders(organization.customerId)
      .then(response => {
        const { providers = [] } = response.data;
        self.providers = normalize(providers);

        return providers;
      });
  }

  isAttachmentsDisabled() {
    return this.selectedOrganization === null;
  }

  onAddAttachment = (scope, el) => {
    const { files } = el;

    if (!files[0]) {
      return;
    }

    const upload = new Upload(files[0], {
      bucketId: 'nYrlabBv',
      customerId: this.selectedOrganization.customerId,
      clientId: '2104aaaa-d42b-450c-b1bd-3f271dcccccc',
    });
    this.uploads.push(upload);
    upload.start();
  };

  onRemoveAttachment = selectedUpload => {
    selectedUpload.abort();
    this.uploads = this.uploads.filter(
      upload => upload.id !== selectedUpload.id
    );
  };

  onSubmit(form) {
    if (form.$invalid) {
      return;
    }

    return this.di.$state.go('app.response', {
      accepted: this.acceptedAgreement,
    });
  }
}

app.addModules([availity, uiRouter]).service('request', Request);

export default app;
