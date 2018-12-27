import { extendObservable, action, set } from 'mobx';

const emptyState = {
  request: {
    organization: {
      customerId: null,
    },
    provider: null,
    memberId: null,
    acceptTerms: false,
  },
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
