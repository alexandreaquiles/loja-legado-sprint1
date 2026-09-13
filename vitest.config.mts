import { defineConfig } from 'vitest/config';

// Config própria: o vite.config.mts da raiz é do dashboard do Vendure, não dos testes.
export default defineConfig({
  test: { include: ['test/**/*.test.ts'], environment: 'node' },
});
