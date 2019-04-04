import { createContext } from 'react';
import { action, computed, extendObservable } from 'mobx';
import set from 'lodash.set';
import get from 'lodash.get';

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

export class AppStore {
  constructor(state = {}) {
    extendObservable(this, emptyState, state);

  }

  @computed
  get isProviderDisabled() {
    return get(this, 'request.organization.customerId') === null;
  }

  // react-select doesn't return the event so we pass additional
  // argument to event handler:
  //  - https://github.com/JedWatson/react-select/issues/1631
  //  - https://reactjs.org/docs/handling-events.html#passing-arguments-to-event-handlers
  @action
  setSelectValue = (event, name) => {
    if (name && event) {
      set(this, name, event);
    }
  };

  @action
  setValue = ({ target = {} }) => {
    const { name, value } = target;
    if (name !== undefined && value !== undefined) {
      set(this, name, value);
    }
  };

  @action
  toggle = ({ target = {} }) => {
    const { name, checked } = target;
    if (name !== undefined && checked !== undefined) {
      set(this, name, checked);
    }
  };

  @action
  reset() {
    set(this, emptyState);
  }
}

export default createContext(new AppStore());
