import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

export default {
  presets: [require.resolve('@docusaurus/core/lib/babel/preset')]
};
