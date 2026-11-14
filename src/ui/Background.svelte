<script lang="ts">
  import { settings } from '../game/settings.svelte.ts';

  let canvas: HTMLCanvasElement | undefined = $state();

  // Vytesané kolo s čtveřicovými glyfy za scénou.
  const glyphs = Array.from({ length: 16 }, (_, v) => ({ v, deg: v * 22.5 }));
  const ticks = Array.from({ length: 64 }, (_, k) => k * 5.625);
  const SIDES = [
    { bit: 3, d: 'M-9 -9H9' },
    { bit: 2, d: 'M9 -9V9' },
    { bit: 1, d: 'M9 9H-9' },
    { bit: 0, d: 'M-9 9V-9' },
  ];

  // Prach ve světle pochodní. Při omezených animacích se nevykresluje.
  $effect(() => {
    if (settings.reducedMotion || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const el = canvas;
    let w = 0;
    let h = 0;
    let raf = 0;
    const motes = Array.from({ length: 50 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.5 + Math.random() * 1.6,
      v: 0.000006 + Math.random() * 0.000018,
      a: 0.1 + Math.random() * 0.35,
      p: Math.random() * Math.PI * 2,
    }));
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      el.width = w * dpr;
      el.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);
    let last = performance.now();
    const frame = (t: number) => {
      const dt = Math.min(t - last, 50);
      last = t;
      ctx.clearRect(0, 0, w, h);
      for (const m of motes) {
        m.y += m.v * dt * 0.6;
        m.p += dt * 0.0004;
        if (m.y > 1.02) {
          m.y = -0.02;
          m.x = Math.random();
        }
        const x = (m.x + Math.sin(m.p) * 0.02) * w;
        const y = m.y * h;
        const alpha = m.a * (0.55 + 0.45 * Math.sin(m.p * 1.7));
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 205, 150, ${alpha.toFixed(3)})`;
        ctx.arc(x, y, m.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      ctx.clearRect(0, 0, w, h);
    };
  });
</script>

<div class="bg" aria-hidden="true">
  <div class="wall"></div>

  <svg class="wheel" viewBox="-500 -500 1000 1000">
    <!-- Každá linka dvakrát: stín a o pixel posunuté světlo = vytesaný reliéf. -->
    {#each ['shade', 'light'] as layer (layer)}
      <g class={layer}>
        <circle r="440" />
        <circle r="424" />
        <circle r="300" />
        <circle r="284" />
        <circle r="120" />
        {#each ticks as deg (deg)}
          <line x1="0" y1="-284" x2="0" y2={deg % 22.5 === 0 ? -264 : -274} transform="rotate({deg})" />
        {/each}
        {#each glyphs as g (g.v)}
          <g transform="rotate({g.deg}) translate(0 -362)">
            <rect x="-22" y="-22" width="44" height="44" rx="4" />
            {#each SIDES as s (s.bit)}
              {#if (g.v >> s.bit) & 1}<path d={s.d} class="stroke" />{/if}
            {/each}
          </g>
        {/each}
        <path d="M0 -120 L104 60 L-104 60 Z" />
      </g>
    {/each}
  </svg>

  <div class="torch left"></div>
  <div class="torch right"></div>
  <div class="vignette"></div>
  <canvas bind:this={canvas}></canvas>
</div>

<style>
  .bg {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    overflow: hidden;
    background: var(--bg);
  }
  .wall {
    position: absolute;
    inset: 0;
    background-color: #3e3227;
    background-image: var(--tex-grain), var(--tex-masonry), var(--tex-mottle), var(--tex-relief);
    background-size:
      240px 240px,
      520px 260px,
      700px 700px,
      512px 512px;
    background-position: center top;
    background-blend-mode: normal, normal, normal, overlay;
  }
  .wheel {
    position: absolute;
    left: 50%;
    top: 47%;
    width: min(118vmin, 1000px);
    height: min(118vmin, 1000px);
    transform: translate(-50%, -50%);
  }
  .wheel :global(circle),
  .wheel :global(line),
  .wheel :global(rect),
  .wheel :global(path) {
    fill: none;
    stroke-width: 3;
    stroke-linecap: round;
  }
  .wheel :global(.shade) {
    stroke: rgba(0, 0, 0, 0.42);
  }
  .wheel :global(.light) {
    stroke: rgba(255, 226, 180, 0.07);
    transform: translate(2px, 2.5px);
  }
  .wheel :global(.stroke) {
    stroke-width: 5;
  }
  .torch {
    position: absolute;
    top: -20vmax;
    width: 80vmax;
    height: 80vmax;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(255, 150, 60, 0.26),
      rgba(255, 120, 40, 0.1) 35%,
      transparent 66%
    );
    mix-blend-mode: screen;
    animation: flicker 3.7s ease-in-out infinite;
  }
  .torch.left {
    left: -42vmax;
  }
  .torch.right {
    right: -42vmax;
    animation-duration: 4.3s;
    animation-delay: -1.3s;
  }
  .vignette {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 75% 70% at 50% 46%, rgba(5, 3, 1, 0.18) 30%, rgba(5, 3, 1, 0.8) 100%),
      linear-gradient(180deg, rgba(5, 3, 1, 0.35), transparent 18%, transparent 80%, rgba(5, 3, 1, 0.5));
  }
  canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }
  /* Jemné, pomalé kolísání plamene, žádné blikání. */
  @keyframes flicker {
    0%,
    100% {
      opacity: 0.92;
    }
    14% {
      opacity: 0.8;
    }
    27% {
      opacity: 0.96;
    }
    41% {
      opacity: 0.86;
    }
    55% {
      opacity: 1;
    }
    68% {
      opacity: 0.83;
    }
    84% {
      opacity: 0.95;
    }
  }
</style>
