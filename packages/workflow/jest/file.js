// https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/config/jest/fileTransform.js

import path from 'node:path';

export default {
  process(src, filename) {
    return `export default ${JSON.stringify(path.basename(filename))};`;
  }
};
