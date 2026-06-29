import deepMerge from './helpers/deep-merge.js';
import buildViteConfig from './vite.config.js';

const buildViteProductionConfig = async (settings) => {
  const baseConfig = await buildViteConfig(settings);

  return deepMerge({}, baseConfig, {
    build: {
      outDir: settings.output(),
      sourcemap: true,
      target: 'es2020',
      emptyOutDir: true,
      cssMinify: true,
      reportCompressedSize: false,
      rolldownOptions: {
        output: {
          entryFileNames: 'assets/[name]-[hash:8].js',
          chunkFileNames: 'assets/[name]-[hash:8].chunk.js',
          assetFileNames: 'assets/[name]-[hash:8][extname]',
          codeSplitting: {
            groups: [{ name: 'vendor-react', test: /[/\\]node_modules[/\\](react|react-dom)[/\\]/ }],
          },
        },
      },
    },
    server: undefined,
  });
};

export default buildViteProductionConfig;
