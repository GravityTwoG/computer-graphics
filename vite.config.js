// vite.config.js
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [],
  build: {
    rollupOptions: {
      input: {
        index: fileURLToPath(new URL('./index.html', import.meta.url)),
        draw: fileURLToPath(new URL('./pages/draw.html', import.meta.url)),
        fill: fileURLToPath(new URL('./pages/fill.html', import.meta.url)),
      },
    },
  },
});
