// vite.config.js
import { resolve } from 'path';
import { defineConfig } from 'vite';

const root = resolve(__dirname, 'src');
const outDir = resolve(__dirname, 'dist');

export default defineConfig({
  root,
  plugins: [],
  build: {
    outDir,
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: resolve(root, 'index.html'),
        draw: resolve(root, 'pages/draw.html'),
        fill: resolve(root, 'pages/fill.html'),
      },
    },
  },
});
