import fs from 'node:fs';
import path from 'node:path';
import deepMerge from './helpers/deep-merge.js';
import buildViteConfig from './vite.config.js';

const buildViteProductionConfig = async (settings) => {
  const baseConfig = await buildViteConfig(settings);

  // Staging builds are optimized for debuggability — source maps on, minification
  // off, compressed size reporting on so bundle bloat is visible before production.
  // Production builds are optimized for delivery — no source maps, fully minified,
  // compressed size reporting off to keep CI fast.
  const isStaging = settings.isStaging();

  const plugins = [];

  // Rolldown (Vite 8) ignores build.sourcemap: false and emits .map files along
  // with //# sourceMappingURL= comments regardless of the setting. Until the
  // upstream bug is fixed, use a writeBundle plugin to delete source maps for
  // production builds. writeBundle fires after all files are written and before
  // closeBundle (where the force-exit plugin calls process.exit()), so the
  // cleanup completes before the process terminates.
  // Staging builds intentionally keep source maps for debuggability.
  if (!isStaging) {
    plugins.push({
      name: 'availity-remove-sourcemaps',
      apply: 'build',
      async writeBundle(options) {
        const outDir = options.dir ?? settings.output();
        try {
          const entries = await fs.promises.readdir(outDir, { recursive: true });
          const mapFiles = entries.filter((f) => f.endsWith('.map'));
          if (mapFiles.length > 0) {
            await Promise.all(mapFiles.map((f) => fs.promises.unlink(path.join(outDir, f)).catch(() => {})));
          }
        } catch {
          // best-effort — if cleanup fails the build still succeeds
        }
      },
    });
  }

  const merged = deepMerge({}, baseConfig, {
    build: {
      outDir: settings.output(),
      sourcemap: isStaging,
      // Disable minification for staging so bundles are readable when debugging
      // issues before they reach production. Mirrors webpack's no-Terser staging
      // behavior in @availity/workflow.
      minify: !isStaging,
      target: 'es2020',
      emptyOutDir: true,
      cssMinify: !isStaging,
      // Enable compressed size reporting for staging so bundle bloat is visible
      // in the build output. Disabled for production to keep CI build times fast.
      reportCompressedSize: isStaging,
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
    // Mirror the sourcemap toggle for SCSS — staging gets source paths in compiled
    // CSS for debuggability; production does not.
    css: { preprocessorOptions: { scss: { sourceMap: isStaging } } },
    server: undefined,
  });

  // deepMerge replaces arrays — append production-only plugins to the base plugin
  // list rather than letting the merge clobber it.
  if (plugins.length > 0) {
    merged.plugins = [...(merged.plugins ?? []), ...plugins];
  }

  return merged;
};

export default buildViteProductionConfig;
