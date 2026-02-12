import { defineProject, mergeConfig } from 'vitest/config';
import configShared from '../../vitest.config.js';

export default mergeConfig(
  configShared,
  defineProject({
    test: {
      name: 'mock-server',
      coverage: {
        reportsDirectory: '../../coverage/workflow'
      }
    }
  })
);
