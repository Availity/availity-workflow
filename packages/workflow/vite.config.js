import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
import { toViteProxy } from './scripts/proxy.js';
import paths from './helpers/paths.js';
import resolveModule from './helpers/resolve-module.js';

const require = createRequire(import.meta.url);

const buildViteConfig = (settings) => {
  const resolveApp = (relativePath) => path.resolve(settings.app(), relativePath);
  const getVersion = () => settings.pkg().version || 'N/A';

  // Resolve the entry file (index.js/ts/tsx)
  const entryFile = resolveModule(resolveApp, 'index');

  // Build define map from settings.globals()
  const globals = settings.globals();
  const define = {};
  for (const [key, value] of Object.entries(globals)) {
    define[key] = typeof value === 'string' ? value : JSON.stringify(value);
  }

  // Build proxy config from settings
  const viteProxy = toViteProxy(settings.configuration.proxies);

  // Plugins array - built dynamically to avoid requiring optional deps at module level
  const plugins = [];

  // SWC-based React plugin — 20-70x faster JSX/TS transforms than Babel-based alternative.
  // Falls back to @vitejs/plugin-react (Babel) if SWC plugin isn't installed.
  try {
    const reactSwc = require('@vitejs/plugin-react-swc');
    plugins.push(reactSwc());
  } catch {
    const react = require('@vitejs/plugin-react');
    plugins.push(react());
  }

  // tsconfig paths support (replaces TsconfigPathsPlugin)
  if (fs.existsSync(paths.tsconfig)) {
    const tsconfigPaths = require('vite-tsconfig-paths');
    plugins.push(tsconfigPaths());
  }

  // Static file copying (replaces CopyWebpackPlugin)
  if (fs.existsSync(paths.appStatic)) {
    const { viteStaticCopy } = require('vite-plugin-static-copy');
    plugins.push(
      viteStaticCopy({
        targets: [
          {
            src: path.join(paths.appStatic, '**/*'),
            dest: 'static'
          }
        ]
      })
    );
  }

  // ESLint integration (replaces ESLintPlugin)
  try {
    const eslintPlugin = require('vite-plugin-checker');
    plugins.push(
      eslintPlugin({
        eslint: {
          lintCommand: `eslint "${settings.app()}/**/*.{js,jsx,ts,tsx}"`,
          useFlatConfig: false
        }
      })
    );
  } catch {
    // vite-plugin-checker is optional — skip if not installed
  }

  // Banner plugin for APP_VERSION (replaces webpack.BannerPlugin)
  const bannerPlugin = {
    name: 'availity-banner',
    transformIndexHtml(html) {
      return html.replace(
        '</head>',
        `<script>APP_VERSION=${JSON.stringify(getVersion())};</script>\n</head>`
      );
    }
  };
  plugins.push(bannerPlugin);

  // HTML entry generation - Vite expects index.html at root with a script tag
  // If the project doesn't have an index.html at the app root, we generate one
  const htmlPlugin = {
    name: 'availity-html-entry',
    configureServer(server) {
      // Serve a generated index.html if project doesn't have one
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
    // For build, write a temporary index.html if needed
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
        if (fs.existsSync(projectHtml)) {
          fs.unlinkSync(projectHtml);
        }
      }
    }
  };
  plugins.push(htmlPlugin);

  // Moment locale exclusion (replaces webpack.IgnorePlugin for moment locales)
  // Only matches ./locale imports from within moment's directory
  const momentLocalePlugin = {
    name: 'availity-moment-locale-exclude',
    resolveId(source, importer) {
      if (source === './locale' && importer && /[/\\]moment[/\\]/.test(importer)) {
        return '\0moment-locale-noop';
      }
      return null;
    },
    load(id) {
      if (id === '\0moment-locale-noop') {
        return 'export default {};';
      }
      return null;
    }
  };
  plugins.push(momentLocalePlugin);

  // Duplicate package detection (replaces DuplicatePackageCheckerPlugin)
  // Scans resolved modules during build and warns when multiple versions of the same
  // package are bundled. Same exclusions as the webpack config.
  const duplicateExcludes = new Set([
    'regenerator-runtime',
    'unist-util-visit-parents',
    'scheduler',
    '@babel/runtime'
  ]);
  const duplicateCheckerPlugin = {
    name: 'availity-duplicate-package-checker',
    generateBundle(options, bundle) {
      // Map: package name -> Set of resolved directories
      const packages = new Map();

      for (const chunk of Object.values(bundle)) {
        if (chunk.type !== 'chunk' || !chunk.modules) continue;

        for (const moduleId of Object.keys(chunk.modules)) {
          // Match node_modules/<package> or node_modules/@scope/package
          const match = moduleId.match(/node_modules[/\\](@[^/\\]+[/\\][^/\\]+|[^/\\]+)/);
          if (!match) continue;

          const pkgName = match[1].replace(/\\/g, '/');
          if (duplicateExcludes.has(pkgName)) continue;

          // Get the full path up to the package root to distinguish versions
          const nmIndex = moduleId.lastIndexOf('node_modules');
          const pkgRoot = moduleId.slice(0, nmIndex + 'node_modules/'.length + match[1].length);

          if (!packages.has(pkgName)) {
            packages.set(pkgName, new Set());
          }
          packages.get(pkgName).add(pkgRoot);
        }
      }

      for (const [pkgName, locations] of packages) {
        if (locations.size > 1) {
          const Logger = require('@availity/workflow-logger');
          Logger.warn(
            `Duplicate package: ${pkgName} bundled from ${locations.size} locations:\n${
            [...locations].map((loc) => `  - ${loc}`).join('\n')
            }\nFix with yarn resolutions in package.json: https://yarnpkg.com/configuration/manifest#resolutions`
          );
        }
      }
    }
  };
  plugins.push(duplicateCheckerPlugin);

  const config = {
    root: settings.app(),
    define,

    server: {
      port: settings.port(),
      host: settings.host(),
      open: settings.open() || false,
      proxy: viteProxy
    },

    resolve: {
      // Force single resolution for critical packages that break with duplicates
      dedupe: ['react', 'react-dom'],
      alias: {
        '@/': `${settings.app()}/`
      },
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.css', '.scss']
    },

    css: {
      preprocessorOptions: {
        scss: {
          sourceMap: true
        }
      }
    },

    plugins,

    // Eagerly pre-bundle known heavy deps so first page load doesn't waterfall
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-dom/client',
        'react-router-dom',
        'lodash',
        'axios',
        'moment',
        '@availity/api-axios',
        '@availity/api-core'
      ]
    },

    build: {
      outDir: settings.output(),
      sourcemap: true,
      // Dev uses esnext for fastest transforms; production config overrides to es2020
      target: settings.isDevelopment() ? 'esnext' : 'es2020',
      emptyOutDir: true
    }
  };

  return config;
};

function generateIndexHtml(settings, entryFile) {
  const title = settings.title();
  const relativeEntry = path.relative(settings.app(), entryFile);

  // Check for project favicon
  const projectFavicon = path.join(settings.app(), 'favicon.ico');
  const workflowFavicon = path.join(import.meta.dirname, './public/favicon.ico');
  const faviconPath = fs.existsSync(projectFavicon) ? './favicon.ico' : path.relative(settings.app(), workflowFavicon);

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
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

export default buildViteConfig;
