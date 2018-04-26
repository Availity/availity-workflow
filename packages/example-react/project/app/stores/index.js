import AppStore from './appStore';
import stateStore from './stateStore';

const appStore = new AppStore(stateStore);

export { stateStore, appStore };
