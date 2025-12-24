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
    plugins: [tailwindcss()]
  }
});