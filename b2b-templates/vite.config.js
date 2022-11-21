import { resolve } from 'path';
import { defineConfig, loadEnv } from 'vite';
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir:'../dist',
    lib: {
      entry: resolve(__dirname, "vite.css-lib.js"),
      name: "MyCssLib",
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('../src', import.meta.url))
    }
  }
});

