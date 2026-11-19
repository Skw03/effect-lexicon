import { defineConfig } from 'vitest/config';
import { resolveReleaseConfig, releaseDefines, validateReleaseAssets } from './scripts/release-config.mjs';
import tailwindcss from 'tailwindcss';
export default defineConfig(({ mode }) => {
  const config = resolveReleaseConfig(mode);
  validateReleaseAssets(config);
  return {
  envFile: false,
  define: releaseDefines(config),
  css: { postcss: { plugins: [tailwindcss()] } },
  test: { environment: 'node' },
  };
});
