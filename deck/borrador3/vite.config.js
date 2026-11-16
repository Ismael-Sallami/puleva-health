import { defineConfig } from 'vite';
import { resolve } from 'path';
export default defineConfig({
  base: './',
  server: { port: 5195, host: '127.0.0.1' },
  build: { target: 'es2022', rollupOptions: { input: { main: resolve(import.meta.dirname, 'index.html'), spot: resolve(import.meta.dirname, 'spot.html') } } },
});
