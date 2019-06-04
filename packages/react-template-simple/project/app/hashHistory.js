import createHashSource from 'hash-source';
import { createHistory } from '@reach/router';

const source = createHashSource();
const hashHistory = createHistory(source);


export default hashHistory;
