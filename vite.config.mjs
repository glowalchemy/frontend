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
  const proxyTarget = env.VITE_PROXY_TARGET || 'http://localhost:8000';

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
      // Split long-lived vendor code into its own chunks so app-code deploys do
      // not invalidate the React/MUI/Swiper cache, and so the browser can fetch
      // them in parallel with the entry chunk.
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) return undefined;
            if (id.includes('react-router')) return 'vendor-router';
            if (id.includes('@mui') || id.includes('@emotion') || id.includes('styled-components')) return 'vendor-mui';
            if (id.includes('swiper')) return 'vendor-swiper';
            if (id.includes('socket.io')) return 'vendor-realtime';
            if (id.includes('react-icons')) return 'vendor-icons';
            if (id.includes('react-dom') || id.includes('/react/')) return 'vendor-react';
            return undefined;
          },
        },
      },
    },
  };
});
