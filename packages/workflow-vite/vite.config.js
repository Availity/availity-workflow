import fs from 'node:fs';
import path from 'node:path';
import Logger from '@availity/workflow-logger';
import toViteProxy from './helpers/proxy.js';
import paths from './helpers/paths.js';
import resolveModule from './helpers/resolve-module.js';

const buildViteConfig = async (settings) => {
  const resolveApp = (relativePath) => path.resolve(settings.app(), relativePath);
  const getVersion = () => settings.pkg().version || 'N/A';
  const entryFile = resolveModule(resolveApp, 'index');

  // Build define map
  const globals = settings.globals();
  const define = {};
  for (const [key, value] of Object.entries(globals)) {
    define[key] = typeof value === 'string' ? value : JSON.stringify(value);
  }

  const viteProxy = toViteProxy(settings.configuration.proxies);
  const plugins = [];

  // React plugin — prefer SWC, fall back to Babel
  try {
    const { default: reactSwc } = await import('@vitejs/plugin-react-swc');
    plugins.push(reactSwc());
  } catch {
    const { default: react } = await import('@vitejs/plugin-react');
    plugins.push(react());
  }

  // tsconfig paths — use Vite 8 built-in support
  const useTsconfigPaths = fs.existsSync(paths.tsconfig);

  // Static file copying
  if (fs.existsSync(paths.appStatic)) {
    const { viteStaticCopy } = await import('vite-plugin-static-copy');
    plugins.push(viteStaticCopy({ targets: [{ src: path.join(paths.appStatic, '**/*'), dest: 'static' }] }));
  }

  // ESLint checker
  try {
    const { default: eslintPlugin } = await import('vite-plugin-checker');
    plugins.push(
      eslintPlugin({
        overlay: false,
        eslint: { lintCommand: `eslint "${settings.app()}/**/*.{js,jsx,ts,tsx}"`, useFlatConfig: true },
      })
    );
  } catch {
    /* optional */
  }

  function generateIndexHtml(s, entry) {
    const title = s.title();
    const relativeEntry = path.relative(s.app(), entry);
    const projectFavicon = path.join(s.app(), 'favicon.ico');
    const workflowFavicon = path.join(import.meta.dirname, './public/favicon.ico');
    const faviconPath = fs.existsSync(projectFavicon) ? './favicon.ico' : path.relative(s.app(), workflowFavicon);

    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <link rel="icon" href="${faviconPath}">
</head>
<body>
  <div id="root"></div>
  <script type="module" src="./${relativeEntry}"></script>
</body>
</html>`;
  }

  // APP_VERSION banner
  plugins.push({
    name: 'availity-banner',
    transformIndexHtml(html) {
      return html.replace('</head>', `<script>APP_VERSION=${JSON.stringify(getVersion())};</script>\n</head>`);
    },
  });

  // HTML entry generation
  // eslint-disable-next-line unicorn/prefer-single-call
  plugins.push({
    name: 'availity-html-entry',
    configureServer(server) {
      const projectHtml = path.join(settings.app(), 'index.html');
      if (!fs.existsSync(projectHtml)) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/' || req.url === '/index.html') {
            res.setHeader('Content-Type', 'text/html');
            res.end(generateIndexHtml(settings, entryFile));
            return;
          }
          next();
        });
      }
    },
    buildStart() {
      const projectHtml = path.join(settings.app(), 'index.html');
      if (!fs.existsSync(projectHtml)) {
        this._generatedHtml = true;
        fs.writeFileSync(projectHtml, generateIndexHtml(settings, entryFile));
      }
    },
    buildEnd() {
      if (this._generatedHtml) {
        const projectHtml = path.join(settings.app(), 'index.html');
        if (fs.existsSync(projectHtml)) fs.unlinkSync(projectHtml);
      }
    },
  });

  // Duplicate package checker
  const duplicateExcludes = new Set(['regenerator-runtime', 'unist-util-visit-parents', 'scheduler', '@babel/runtime']);
  plugins.push({
    name: 'availity-duplicate-package-checker',
    generateBundle(options, bundle) {
      const packages = new Map();
      for (const chunk of Object.values(bundle)) {
        if (chunk.type !== 'chunk' || !chunk.modules) continue;
        for (const moduleId of Object.keys(chunk.modules)) {
          const match = moduleId.match(/node_modules[/\\](@[^/\\]+[/\\][^/\\]+|[^/\\]+)/);
          if (!match) continue;
          const pkgName = match[1].replaceAll('\\', '/');
          if (duplicateExcludes.has(pkgName)) continue;
          const nmIndex = moduleId.lastIndexOf('node_modules');
          const pkgRoot = moduleId.slice(0, nmIndex + 'node_modules/'.length + match[1].length);
          if (!packages.has(pkgName)) packages.set(pkgName, new Set());
          packages.get(pkgName).add(pkgRoot);
        }
      }
      for (const [pkgName, locations] of packages) {
        if (locations.size > 1) {
          Logger.warn(
            `Duplicate package: ${pkgName} bundled from ${locations.size} locations:\n${[...locations].map((l) => `  - ${l}`).join('\n')}`
          );
        }
      }
    },
  });

  return {
    root: settings.app(),
    define,
    server: {
      port: settings.port(),
      host: settings.host(),
      open: settings.open() || false,
      proxy: viteProxy,
    },
    resolve: {
      tsconfigPaths: useTsconfigPaths,
      dedupe: ['react', 'react-dom'],
      alias: { '@/': `${settings.app()}/` },
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.css', '.scss'],
    },
    css: { preprocessorOptions: { scss: { sourceMap: true } } },
    plugins,
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-dom/client', 'react-router-dom', 'axios'],
    },
    build: {
      outDir: settings.output(),
      sourcemap: true,
      target: settings.isDevelopment() ? 'esnext' : 'es2020',
      emptyOutDir: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return 'vendor';
            }
            return undefined;
          },
        },
      },
    },
  };
};

export default buildViteConfig;
