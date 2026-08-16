import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Frontend Vite configuration.
 *
 * The canonical brand value comes from the single `BRAND_NAME` env variable
 * (see frontend/.env and the root .env.example). It is injected into the
 * browser bundle as `import.meta.env.VITE_BRAND_NAME` and into index.html as
 * `%BRAND_NAME%`. There is intentionally no second brand variable to maintain.
 */
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const brandName = (env.BRAND_NAME || 'GlowAlchemy').trim();
  const proxyTarget = env.VITE_PROXY_TARGET || 'http://localhost:5000';

  return {
    plugins: [react()],
    css: {
      lightningcss: false,
    },
    // Expose BRAND_* vars to the client so `%BRAND_NAME%` in index.html is
    // replaced too. VITE_BRAND_NAME (below) is derived from the same value.
    envPrefix: ['VITE_', 'BRAND_'],
    define: {
      'import.meta.env.VITE_BRAND_NAME': JSON.stringify(brandName),
    },
    server: {
      port: 3000,
      host: true,
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
          secure: false,
        },
        '/uploads': {
          target: proxyTarget,
          changeOrigin: true,
          secure: false,
        },
        '/socket.io': {
          target: proxyTarget,
          changeOrigin: true,
          secure: false,
          ws: true,
        },
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: true,
    },
  };
});
