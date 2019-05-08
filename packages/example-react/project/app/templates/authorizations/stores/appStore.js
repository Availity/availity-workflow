import { action, computed } from 'mobx';
import set from 'lodash.set';
import get from 'lodash.get';

export default class AppStore {
  constructor(state) {
    this.state = state;
  }

  @computed
  get isProviderDisabled() {
    return get(this, 'state.request.organization.customerId') === null;
  }

  // react-select doesn't return the event so we pass additional
  // argument to event handler:
  //  - https://github.com/JedWatson/react-select/issues/1631
  //  - https://reactjs.org/docs/handling-events.html#passing-arguments-to-event-handlers
  @action
  setSelectValue = (event, name) => {
    if (name && event) {
      set(this.state, name, event);
    }
  };

  @action
  setValue = ({ target = {} }) => {
    const { name, value } = target;
    if (name !== undefined && value !== undefined) {
      set(this.state, name, value);
    }
  };

  @action
  toggle = ({ target = {} }) => {
    const { name, checked } = target;
    if (name !== undefined && checked !== undefined) {
      set(this.state, name, checked);
    }
  };
}
