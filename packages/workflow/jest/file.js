// https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/config/jest/fileTransform.js

import path from 'path';

export default {
  process(src, filename) {
    return {
      code: `module.exports = ${JSON.stringify(path.basename(filename))};`
    };
  }
};
