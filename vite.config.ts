import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { VitePWA } from 'vite-plugin-pwa';
import pkg from './package.json' with { type: 'json' };

const BG = '#0F0C1D';

export default defineConfig(({ mode }) => ({
  // Relativní cesty: hra běží z kořene domény (Cloudflare, Netlify) i z podsložky
  // (GitHub Pages /svetlo-a-stin/) bez úprav.
  base: './',
  // Verze hry z package.json (0.4.0-alpha), hra ji ukáže jako „0.4 alpha“.
  define: { __APP_VERSION__: JSON.stringify(pkg.version) },
  plugins: [
    svelte(),
    VitePWA({
      // Samostatné HTML (npm run build:single) se otevírá z disku, kde service worker nejde.
      disable: mode === 'single',
      // Novou verzi hráč načte sám tlačítkem, ať se hra nepřepne uprostřed komnaty.
      registerType: 'prompt',
      injectRegister: false,
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        id: './',
        name: 'Světlo & Stín',
        short_name: 'Světlo&Stín',
        description: 'Didaktická hra o binární matematice a logice: krystaly, runy a brány Lumenitů.',
        lang: 'cs',
        dir: 'ltr',
        start_url: './',
        scope: './',
        display: 'standalone',
        orientation: 'any',
        background_color: BG,
        theme_color: BG,
        categories: ['education', 'games'],
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          { src: 'favicon.svg', sizes: 'any', type: 'image/svg+xml' },
        ],
      },
      workbox: {
        // Celá hra do mezipaměti, ať po první návštěvě běží i bez internetu. Z písem jen latinka
        // a latinka s diakritikou ve woff2 (ostatní abecedy a starší formát hra nepotřebuje).
        globPatterns: ['**/*.{js,css,html}', '**/*-latin-*.woff2', '**/svetlo-logika-*.woff2'],
        cleanupOutdatedCaches: true,
      },
    }),
  ],
  build: {
    // Licence knihoven a písem, které jsou přibalené do hry (MIT, SIL OFL).
    license: { fileName: 'licence-knihoven.md' },
  },
  server: {
    port: 5173,
    strictPort: true,
    // Na tomto disku nefunguje nativní sledování souborů, proto polling.
    watch: { usePolling: true, interval: 300 },
  },
}));
