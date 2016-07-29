import fs from 'fs';
import path from 'path';
import config from '../config';

export default banner() => {

  const  package = JSON.parse(fs.readFileSync(path.join(config.project.path, 'package.json')));
  const today = new Date().toISOString().substr(0, 10)

  return `
/**
 * ${package.name} v${package.version} -- ${today}
 *
 *
 /**`;

}

