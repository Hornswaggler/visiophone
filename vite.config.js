import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv, splitVendorChunkPlugin } from 'vite'
import vue2 from '@vitejs/plugin-vue2'

export default defineConfig(async ({command, mode}) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    server: {
      proxy:{
        '/api':{
          target: 'http://192.168.0.103:7071',
          changeOrigin: true,
        }
      }
    },
    define: {
      __APP_ENV__: env.APP_ENV
    },
    plugins: [
      vue2(),
      splitVendorChunkPlugin()
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  };
});
