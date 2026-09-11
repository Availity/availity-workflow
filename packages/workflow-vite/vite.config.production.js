import deepMerge from './helpers/deep-merge.js';
import buildViteConfig from './vite.config.js';

const buildViteProductionConfig = async (settings) => {
  const baseConfig = await buildViteConfig(settings);

  return deepMerge({}, baseConfig, {
    build: {
      outDir: settings.output(),
      sourcemap: settings.configuration.development.sourceMap,
      target: 'es2020',
      emptyOutDir: true,
      cssMinify: true,
      reportCompressedSize: false,
      rolldownOptions: {
        output: {
          entryFileNames: 'assets/[name]-[hash:8].js',
          chunkFileNames: 'assets/[name]-[hash:8].chunk.js',
          assetFileNames: 'assets/[name]-[hash:8][extname]',
          manualChunks(id) {
            if (/node_modules[/\\](react|react-dom)[/\\]/.test(id)) return 'vendor-react';
            if (id.includes('node_modules')) return 'vendor';
            return undefined;
          },
        },
      },
    },
    server: undefined,
  });
};

export default buildViteProductionConfig;
