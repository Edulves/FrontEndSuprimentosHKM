import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      port: 3000,
      proxy: {
        // API .NET (Localizador de Fornecedores)
        '/api': {
          target: 'https://suprimentoshkmapi.foxheart.com.br',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, '')
        },
        // API Python (solicitações, cotações, ordens de compra e compras)
        '/suprimentos': {
          target: env.SUPRIMENTOS_API_URL || 'http://localhost:8000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/suprimentos/, '')
        }
      }
    }
  }
})
