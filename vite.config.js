import { defineConfig } from 'vite'
import vue from '@vitejs.plugin-vue'

// Reemplaza 'contador-divisas-pe' por el nombre exacto de tu repositorio de GitHub
export default defineConfig({
  plugins: [vue()],
  base: '/contador-divisas-pe/',
})