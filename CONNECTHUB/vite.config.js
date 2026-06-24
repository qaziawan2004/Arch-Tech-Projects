import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: './index.html',
      },
      external: [], // Don't bundle server files
    },
  },
  server: {
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
});