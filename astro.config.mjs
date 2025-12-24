// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  output: 'server', // Habilitar modo server para endpoints API
  adapter: node({
    mode: 'standalone'
  }),
  vite: {
    plugins: [tailwindcss()],
    build: {
      cssMinify: true,
      minify: 'esbuild', // Usar esbuild para mejor rendimiento
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // Separar vendor chunks para mejor caching
            if (id.includes('node_modules')) {
              if (id.includes('aos')) {
                return 'vendor-aos';
              }
              return 'vendor';
            }
          }
        }
      }
    },
    esbuild: {
      // Eliminar console.log y debugger en producción
      drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : []
    }
  }
});