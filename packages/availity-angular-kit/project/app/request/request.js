import app from 'app-module';
import { availity } from 'availity-angular';
import uiRouter from 'angular-ui-router';

class Request {

  constructor(avOrganizationsResource, avUsersResource, avProvidersResource, $state) {

    this.di = { avOrganizationsResource, avUsersResource, avProvidersResource, $state };

    this.memberId = null;
    this.selectedOrganization = null;
    this.organizations = null;
    this.selectedProvider = null;
    this.providers = null;
    this.npi = null;
    this.dob = null;
    this.relationshipToSubscriber = null;
    this.acceptedAgreement = false;

  }

  init() {
    return this.getOrganizations().then(() => this);
  }

  getUser() {

    const self = this;

    return this.di.
      avUsersResource
        .me()
        .then(user => {
          // cache user
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

  queryOrganizations() {

    const self = this;

    return this.di.avOrganizationsResource
      .getOrganizations()
      .then(organizations => {
        // cache organizations
        self.organizations = organizations;
        return organizations;
      });

  }

  getOrganizations() {

    // The :: syntax below is proposed for ES7.  It is equivalent to the following code:
    //
    //    this.getUser().then(this.queryOrganizations.bind(this));
    //
    // Feel free to use either version that suits your coding style.
    //
    return this.getUser()
      .then(::this.queryOrganizations);

  }

  queryProviders(organization) {

    return this.di.avProvidersResource
      .getProviders(organization.customerId);

  }

  getProviders(organization) {

    const self = this;

    return this.queryProviders(organization)
      .then(providers => {
        self.providers = providers;
        return providers;
      });
  }

  onSubmit(form) {

    if (form.$invalid) {
      return;
    }

    return this.di.$state.go('app.response', {
      accepted: this.acceptedAgreement
    });
  }

}

app
  .addModules([
    availity,
    uiRouter
  ])
  .service('request', Request);

export default app;
