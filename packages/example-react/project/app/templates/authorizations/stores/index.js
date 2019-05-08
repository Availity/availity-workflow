import { createContext, useContext } from 'react';
import AppStore from './appStore';
import stateStore from './stateStore';

const appStore = new AppStore(stateStore);

const AppStoreContext = createContext(appStore);
const StateStoreContext = createContext(stateStore);

const useStateStore = () => useContext(StateStoreContext);
const useAppStore = () => useContext(AppStoreContext);

export { useStateStore, useAppStore };
