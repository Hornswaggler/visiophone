import { resolve } from 'path';
import { defineConfig, loadEnv, searchForWorkspaceRoot } from 'vite';
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "vite.css-lib.js"),
      name: "B2BTemplateStyles",
      fileName: 'b2b-template-styles',
    },
    rollupOptions:{
      input: {
        templateSignupSignin: './template_signup_signin.html'
      }
    },
    outDir:'../dist',
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('../src', import.meta.url))
    }
  },
  server:{
    fs:{
      allow:[
        searchForWorkspaceRoot(process.cwd()),
        '../src/assets/'
      ]
    }
  }
});

