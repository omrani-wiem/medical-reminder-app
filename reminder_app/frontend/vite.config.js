import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true
  },
  esbuild: {
    loader: 'jsx',
    include: /src.*\.[tj]sx?$/,
    exclude: []
  },
  resolve: {
    alias: {
      'd3-shape': path.resolve('./node_modules/d3-shape/dist/d3-shape.js')
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx'
      }
    }
  }
})