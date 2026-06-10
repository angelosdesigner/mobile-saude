import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    vue(),
    tailwindcss(),
    AutoImport({
      // Auto-import Element Plus APIs (ElMessage, ElLoading, etc.).
      // importStyle: false — styles are NOT injected per-call; they come from
      // the single layered `element-plus/dist/index.css` import in style.css.
      resolvers: [ElementPlusResolver({ importStyle: false })],
    }),
    Components({
      // Auto-import Element Plus components (<el-button>, <el-input>, ...).
      // importStyle: false is REQUIRED for the cascade to work: with
      // importStyle:'css' each component's CSS is injected UNLAYERED, and
      // unlayered rules outrank every @layer — so Tailwind utilities could
      // never override Element Plus. By disabling injection here and importing
      // EP's CSS once into the `element-plus` layer (see src/style.css), the
      // declared layer order becomes authoritative. See CLAUDE.md.
      resolvers: [ElementPlusResolver({ importStyle: false })],
    }),
  ],
})
