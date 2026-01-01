import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import viteDevTools from 'vite-plugin-vue-devtools'
import { URL, fileURLToPath } from 'url'
import legacy from '@vitejs/plugin-legacy'
import autoprefixer from 'autoprefixer'
import { viteMockServe } from 'vite-plugin-mock'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [
      vue(),
      // Vite开发者工具插件配置
      viteDevTools(),
      // 兼容旧浏览器配置
      legacy(),
      // Mock模拟请求插件配置
      viteMockServe({
        mockPath: 'mock'
      }),
      AutoImport({
        resolvers: [ElementPlusResolver()]
      }),
      Components({
        resolvers: [ElementPlusResolver()]
      })
    ],
    server: {
      port: 8080,
      open: false,
      hmr: true
      // proxy: {
      //   '/api': {
      //     target: 'http://localhost:3000', // 网易云API端口
      //     changeOrigin: true,
      //     rewrite: path => path.replace(/^\/api/, '')
      //   }
      // }
    },
    build: {
      outDir: 'dist',
      sourcemap: true
    },
    css: {
      preprocessorOptions: {
        scss: {
          importers: ['@assets/styles/resize.scss']
        }
      },
      postcss: {
        plugins: [autoprefixer()]
      },
      // 开发环境下启用 CSS 源映射
      devSourcemap: mode === 'development' ? true : false
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@assets': fileURLToPath(new URL('./src/assets', import.meta.url))
      }
    }
  }
})
