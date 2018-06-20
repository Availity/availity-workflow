import Loader from 'react-loadable';

const LoadableRequest = Loadable(() => import('./Request'));

export default LoadableRequest;
