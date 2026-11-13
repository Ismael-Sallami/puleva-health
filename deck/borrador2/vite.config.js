import { defineConfig } from 'vite';
import { resolve } from 'path';
export default defineConfig({
  base: './',
  server: { port: 5190, host: true },
  build: { target: 'es2022', rollupOptions: { input: { main: resolve(import.meta.dirname, 'index.html'), spot: resolve(import.meta.dirname, 'spot.html') } } },
});
