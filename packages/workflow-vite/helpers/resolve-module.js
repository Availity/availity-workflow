import fs from 'node:fs';

const moduleFileExtensions = ['mjs', 'js', 'ts', 'tsx', 'jsx', 'json'];

const resolveModule = (resolveFn, filePath) => {
  const extension = moduleFileExtensions.find((ext) => fs.existsSync(resolveFn(`${filePath}.${ext}`)));
  return resolveFn(`${filePath}.${extension || 'js'}`);
};

export default resolveModule;
