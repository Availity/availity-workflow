import path from 'node:path';
import * as url from 'node:url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export const data = path.join(__dirname, './data');
export const routes = path.join(__dirname, './routes.json')
