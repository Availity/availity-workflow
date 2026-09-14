/**
 * Apply the user's modifyViteConfig function if provided.
 * Returns the (possibly modified) config, or the original if no function is set.
 *
 * @param {object} viteConfig - The current Vite config object
 * @param {object} settings - The workflow settings instance
 * @returns {object} The vite config, potentially modified
 */
export default function applyModifyViteConfig(viteConfig, settings) {
  const { modifyViteConfig } = settings.config();
  if (typeof modifyViteConfig === 'function') {
    return modifyViteConfig(viteConfig, settings) || viteConfig;
  }
  return viteConfig;
}
