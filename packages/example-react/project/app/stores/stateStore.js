import { extendObservable } from 'mobx';

class StateStore {
  constructor(state = {}) {
    extendObservable(
      this,
      {
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
      },
      state
    );
  }
}

export default new StateStore();

export { StateStore };
