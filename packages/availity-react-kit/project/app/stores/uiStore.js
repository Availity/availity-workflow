import { action, computed, observable } from 'mobx';
import Response from '../Response/models/response';

export class UiStore {
  @observable year = new Date(Date.now()).getFullYear();
  @observable currentResponse = null;

  @action
  setCurrentResponse(response) {
    this.currentResponse = new Response(response);
  }

  @computed
  get title() {
    return this.currentResponse ? 'Authorization Response' : 'Authorization Request';
  }
}

export default new UiStore();
