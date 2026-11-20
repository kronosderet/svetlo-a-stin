import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  // Hry (src/game/*.svelte.ts) stojí na runách Svelte. Test „hraj jen podle ukázky“ je hraje přímo,
  // ať hlídá skutečné ukázky kroku a stupně nápovědy, ne jejich opis.
  plugins: [svelte()],
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
  },
});
