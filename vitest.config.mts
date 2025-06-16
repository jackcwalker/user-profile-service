import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@handlers': path.resolve(__dirname, 'src/handlers'),
      '@utils': path.resolve(__dirname, 'src/utils'),
    },
  },
});
