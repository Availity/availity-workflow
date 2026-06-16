/**
 * Convert workflow proxy config to Vite proxy format.
 * Workflow: [{ context: ['/api', '/ms'], target: 'http://...', pathRewrite: { '^/api': '' }, headers: {} }]
 * Vite: { '/api': { target, rewrite, headers }, '/ms': { target, headers } }
 */
export default function toViteProxy(proxies) {
  if (!proxies) return undefined;

  const viteProxy = {};

  for (const proxyConfig of proxies) {
    if (!proxyConfig.enabled) continue;

    const contexts = Array.isArray(proxyConfig.context) ? proxyConfig.context : [proxyConfig.context];

    for (const ctx of contexts) {
      const entry = {
        target: proxyConfig.target,
        changeOrigin: true,
        ws: proxyConfig.ws !== false
      };

      if (proxyConfig.headers) {
        entry.headers = proxyConfig.headers;
      }

      if (proxyConfig.pathRewrite) {
        const rewrites = Object.entries(proxyConfig.pathRewrite).map(([pattern, replacement]) => [new RegExp(pattern), replacement]);
        entry.rewrite = (reqPath) => {
          let result = reqPath;
          for (const [regex, replacement] of rewrites) {
            result = result.replace(regex, replacement);
          }
          return result;
        };
      }

      viteProxy[ctx] = entry;
    }
  }

  return Object.keys(viteProxy).length === 0 ? undefined : viteProxy;
}
