const merge = require('lodash/merge');
const buildViteConfig = require('./vite.config');

const buildViteProductionConfig = (settings) => {
  const baseConfig = buildViteConfig(settings);

  const productionOverrides = {
    build: {
      outDir: settings.output(),
      sourcemap: true,
      target: 'es2020',
      emptyOutDir: true,
      cssMinify: true,
      // Skip gzip size calculation — slow on large bundles and CI doesn't need it
      reportCompressedSize: false,
      rollupOptions: {
        output: {
          // Match webpack's chunk naming with content hashes
          entryFileNames: 'assets/[name]-[hash:8].js',
          chunkFileNames: 'assets/[name]-[hash:8].chunk.js',
          assetFileNames: 'assets/[name]-[hash:8][extname]',
          manualChunks(id) {
            if (id.includes('node_modules')) {
              // React/ReactDOM vendor chunk
              if (/[/\\]node_modules[/\\](react|react-dom)[/\\]/.test(id)) {
                return 'vendor-react';
              }
              // Lodash vendor chunk
              if (/[/\\]node_modules[/\\](lodash([.-])?\w*?)[/\\]/.test(id)) {
                return 'vendor-lodash';
              }
              // Moment vendor chunk
              if (/[/\\]node_modules[/\\](moment)[/\\]/.test(id)) {
                return 'vendor-moment';
              }
            }
          }
        }
      }
    },
    // Disable dev server in production builds
    server: undefined
  };

  return merge({}, baseConfig, productionOverrides);
};

module.exports = buildViteProductionConfig;
