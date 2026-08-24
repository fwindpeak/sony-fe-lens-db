import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // 保证纯静态与相对路径部署友好
  server: {
    port: 3000,
    open: false,
  },
});
