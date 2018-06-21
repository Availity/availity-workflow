import { extendObservable, action, set } from 'mobx';

const emptyState = {
  user: {
    username: null
  },
  form: {
    selectedOrganization: null,
    organizations: [],
    selectedProvider: null,
    providers: [],
    npi: null,
    memberId: null,
    dob: null,
    acceptTerms: false
  },
  page: {
    title: null
  }
};

class StateStore {
  constructor(state = {}) {
    extendObservable(this, emptyState, state);
  }

  @action
  reset() {
    set(this, emptyState);
  }
}

export default new StateStore();

export { StateStore };
