import fs from 'node:fs';
import path from 'node:path';
import Logger from '@availity/workflow-logger';
import toViteProxy from './helpers/proxy.js';
import paths from './helpers/paths.js';
import resolveModule from './helpers/resolve-module.js';

const buildViteConfig = async (settings) => {
  // Suppress Node.js deprecation warnings when configured (default: true).
  // Vite 8/Rolldown and upstream packages emit warnings that apps cannot resolve.
  if (settings.configuration.development.suppressDeprecationWarnings) {
    process.noDeprecation = true;
  }

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

  // React plugin — prefer standard plugin for Rolldown compatibility, fall back to SWC
  try {
    const { default: react } = await import('@vitejs/plugin-react');
    plugins.push(react());
  } catch {
    const { default: reactSwc } = await import('@vitejs/plugin-react-swc');
    plugins.push(reactSwc());
  }

  // tsconfig paths — use Vite 8 built-in support
  const useTsconfigPaths = fs.existsSync(paths.tsconfig);

  // Static file copying
  if (fs.existsSync(paths.appStatic)) {
    const { viteStaticCopy } = await import('vite-plugin-static-copy');
    plugins.push(viteStaticCopy({ targets: [{ src: path.join(paths.appStatic, '**/*'), dest: 'static' }] }));
  }

  // ESLint checker (dev server only — shows lint errors as overlay and in terminal)
  try {
    const { default: checker } = await import('vite-plugin-checker');
    const eslintConfig = settings.config().eslint ?? {};
    const { watchPath, failOnWarning = false } = eslintConfig;

    // dev.logLevel controls which severity levels are shown in the overlay/terminal.
    // Always show errors. Show warnings too only when failOnWarning is enabled so that
    // the dev server doesn't flood the overlay with warnings that won't fail the build.
    const logLevel = failOnWarning ? ['error', 'warning'] : ['error'];

    const checkerOptions = {
      overlay: false,
      eslint: {
        lintCommand: `eslint "${settings.app()}/**/*.{js,jsx,ts,tsx}"`,
        useFlatConfig: true,
        ...(watchPath ? { watchPath } : {}),
        dev: { logLevel },
      },
    };

    // Opt-in TypeScript type checking. Runs tsc --noEmit in a worker thread so
    // it does not block Vite's HMR. Type errors surface in the terminal during
    // development and fail production builds. Disabled by default — enable via
    // development.typeCheck: true in workflow.js.
    const typeCheckEnabled = settings.configuration.development.typeCheck && fs.existsSync(paths.tsconfig);

    if (typeCheckEnabled) {
      checkerOptions.typescript = { tsconfigPath: paths.tsconfig };
    }

    plugins.push(checker(checkerOptions));
  } catch {
    /* optional */
  }

  // Build status system notifications — respects development.notification (default: true)
  if (settings.configuration.development.notification) {
    const appName = settings.pkg().name || 'workflow-vite';
    let notifier;
    try {
      const mod = await import('node-notifier');
      notifier = mod.default ?? mod;
    } catch {
      // node-notifier not available — skip notifications silently
    }

    if (notifier) {
      plugins.push({
        name: 'availity-notifier',
        buildEnd(error) {
          if (error) {
            notifier.notify({ title: appName, message: `Build failed: ${error.message}`, sound: true });
          }
        },
        closeBundle() {
          notifier.notify({ title: appName, message: 'Build complete', sound: false });
        },
        configureServer(server) {
          server.httpServer?.once('listening', () => {
            notifier.notify({ title: appName, message: 'Dev server ready', sound: false });
          });
        },
      });
    }
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
    // buildEnd is called on both success and failure (error is defined on failure).
    // Always clean up the generated file so a failed build doesn't leave a stale
    // index.html on disk that would confuse subsequent runs or git status.
    buildEnd() {
      if (this._generatedHtml) {
        const projectHtml = path.join(settings.app(), 'index.html');
        try {
          if (fs.existsSync(projectHtml)) fs.unlinkSync(projectHtml);
        } catch {
          // best-effort cleanup — ignore errors
        }
        this._generatedHtml = false;
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

  // Force process exit after build completes.
  // Vite 8 (Rolldown) can leave open handles that prevent Node from exiting naturally.
  // Using setTimeout defers the exit one tick so all closeBundle callbacks finish first.
  // Only applied during builds — not during the dev server.
  // eslint-disable-next-line unicorn/prefer-single-call
  plugins.push({
    name: 'availity-force-exit',
    apply: 'build',
    buildEnd(error) {
      // Track whether the build failed so closeBundle can exit with the right code.
      if (error) this._buildFailed = true;
    },
    closeBundle() {
      const code = this._buildFailed ? 1 : 0;
      // eslint-disable-next-line unicorn/no-process-exit
      setTimeout(() => process.exit(code), 0);
    },
  });

  return {
    root: settings.app(),
    // Use relative base so asset chunk URLs are emitted as ./assets/... rather
    // than /assets/.... Availity apps are typically served from Tyk sub-paths
    // (e.g. /tst/appl/my-service/static/nav/) — absolute paths cause 404s for
    // every JS/CSS chunk even though index.html loads fine.  Relative URLs
    // resolve correctly regardless of deploy depth.  Apps served from the root
    // are unaffected; Vite injects the base into generated HTML at build time
    // so history-mode routing continues to work.
    base: './',
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
    css: { preprocessorOptions: { scss: { sourceMap: settings.configuration.development.sourceMap } } },
    plugins,
    optimizeDeps: {
      // react-router replaces react-router-dom as of v7 — keep both so apps mid-migration
      // still get pre-bundling benefits. react-router-dom is intentionally excluded from
      // the default list; teams still on v6 can add it via development.optimizeDeps.
      include: [
        'react',
        'react-dom',
        'react-dom/client',
        'react-router',
        'axios',
        ...settings.configuration.development.optimizeDeps,
      ],
    },
    build: {
      outDir: settings.output(),
      sourcemap: settings.configuration.development.sourceMap,
      target: settings.isDevelopment() ? 'esnext' : 'es2020',
      emptyOutDir: true,
      rolldownOptions: {
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
