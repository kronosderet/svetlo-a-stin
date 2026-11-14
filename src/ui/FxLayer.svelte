<script lang="ts" module>
  export interface Point {
    x: number;
    y: number;
  }
  export interface Area {
    left: number;
    right: number;
    top: number;
  }
</script>

<script lang="ts">
  /**
   * Vrstva efektů nad scénou: prach a úlomky ze stropu při chybě, stoupající jiskry a vlna
   * světla při splněném kroku, dunění a kaskáda prachu při otevření komnaty.
   * Kreslí se na plátno a smyčka běží jen tehdy, když nějaké částice žijí.
   * Při omezených animacích zůstane jen krátký barevný záblesk.
   */
  import { FX } from '../game/fx.svelte.ts';
  import { settings } from '../game/settings.svelte.ts';

  type Kind = 'dust' | 'chip' | 'mote' | 'spark' | 'ring';
  interface P {
    kind: Kind;
    x: number;
    y: number;
    vx: number;
    vy: number;
    age: number;
    life: number;
    size: number;
    rot: number;
    vr: number;
    tone: number;
    /** Násobek průhlednosti (tlumené efekty). */
    amp: number;
  }

  let canvas: HTMLCanvasElement | undefined = $state();
  let flash: { kind: 'fail' | 'step' | 'win'; n: number; peak: number } | null = $state(null);

  const parts: P[] = [];
  let raf = 0;
  let last = 0;
  let w = 0;
  let h = 0;
  let flashes = 0;

  const rnd = (a: number, b: number) => a + Math.random() * (b - a);

  function add(kind: Kind, x: number, y: number, o: Partial<P> = {}) {
    parts.push({ kind, x, y, vx: 0, vy: 0, age: 0, life: 1000, size: 2, rot: rnd(0, 6.28), vr: 0, tone: Math.random(), amp: 1, ...o });
  }

  function fit() {
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (w === window.innerWidth && h === window.innerHeight) return;
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.getContext('2d')?.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function start() {
    fit();
    if (!raf) {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
  }

  function frame(t: number) {
    const ctx = canvas?.getContext('2d');
    if (!ctx) {
      raf = 0;
      return;
    }
    const dt = Math.min(t - last, 40);
    last = t;
    ctx.clearRect(0, 0, w, h);
    for (let k = parts.length - 1; k >= 0; k--) {
      const p = parts[k];
      p.age += dt;
      if (p.age >= p.life) {
        parts.splice(k, 1);
        continue;
      }
      if (p.age < 0) continue; // zpožděný start (vlny při výhře jdou po sobě)
      const f = p.age / p.life;
      switch (p.kind) {
        case 'dust':
          p.vy += 0.00006 * dt;
          p.vx += Math.sin((p.age + p.tone * 900) / 260) * 0.00002 * dt;
          break;
        case 'chip':
          p.vy += 0.0011 * dt;
          p.rot += p.vr * dt;
          break;
        case 'mote':
          p.vy -= 0.00002 * dt;
          p.vx += Math.sin((p.age + p.tone * 700) / 300) * 0.00003 * dt;
          break;
        case 'spark': {
          const drag = Math.pow(0.994, dt);
          p.vx *= drag;
          p.vy = p.vy * drag + 0.0003 * dt;
          break;
        }
      }
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      draw(ctx, p, f);
    }
    if (parts.length) raf = requestAnimationFrame(frame);
    else {
      raf = 0;
      ctx.clearRect(0, 0, w, h);
    }
  }

  function draw(ctx: CanvasRenderingContext2D, p: P, f: number) {
    const fadeIn = Math.min(1, p.age / 120);
    const alpha = fadeIn * (1 - f) * p.amp;
    ctx.globalCompositeOperation = p.kind === 'mote' || p.kind === 'spark' || (p.kind === 'ring' && p.tone > 0.5) ? 'lighter' : 'source-over';
    switch (p.kind) {
      case 'dust': {
        ctx.fillStyle = `rgba(${200 + p.tone * 30}, ${176 + p.tone * 20}, ${136 + p.tone * 20}, ${(alpha * 0.75).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        break;
      }
      case 'chip': {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        const s = p.size;
        const shade = 70 + Math.round(p.tone * 50);
        ctx.fillStyle = `rgba(${shade + 30}, ${shade + 14}, ${shade - 6}, ${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.moveTo(-s, -s * 0.6);
        ctx.lineTo(s * 0.8, -s);
        ctx.lineTo(s, s * 0.5);
        ctx.lineTo(-s * 0.4, s);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        break;
      }
      case 'mote': {
        const r = p.size * (1 + f * 0.4);
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 4);
        g.addColorStop(0, `rgba(255, 236, 190, ${(alpha * 0.95).toFixed(3)})`);
        g.addColorStop(0.25, `rgba(255, 200, 110, ${(alpha * 0.45).toFixed(3)})`);
        g.addColorStop(1, 'rgba(255, 170, 60, 0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 4, 0, Math.PI * 2);
        ctx.fill();
        break;
      }
      case 'spark': {
        const len = 6 + Math.hypot(p.vx, p.vy) * 30;
        const a = Math.atan2(p.vy, p.vx);
        ctx.strokeStyle = `rgba(255, ${220 + Math.round(p.tone * 30)}, 170, ${alpha.toFixed(3)})`;
        ctx.lineWidth = p.size;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - Math.cos(a) * len, p.y - Math.sin(a) * len);
        ctx.stroke();
        break;
      }
      case 'ring': {
        const r = p.size * (0.15 + 0.85 * (1 - Math.pow(1 - f, 3)));
        ctx.strokeStyle = p.tone > 0.5 ? `rgba(255, 214, 140, ${(alpha * 0.8).toFixed(3)})` : `rgba(150, 60, 30, ${(alpha * 0.7).toFixed(3)})`;
        ctx.lineWidth = 2 + 6 * (1 - f);
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.stroke();
        break;
      }
    }
  }

  function showFlash(kind: 'fail' | 'step' | 'win', peak = 1) {
    flash = { kind, n: ++flashes, peak };
  }

  /** Prach a úlomky padající ze stropu nad oblastí. */
  function ceiling(area: Area, dust: number, chips: number) {
    for (let k = 0; k < dust; k++) {
      add('dust', rnd(area.left, area.right), rnd(area.top - 40, area.top + 10), {
        vx: rnd(-0.015, 0.015),
        vy: rnd(0.03, 0.11),
        life: rnd(1400, 2600),
        size: rnd(1.2, 3.2),
      });
    }
    for (let k = 0; k < chips; k++) {
      add('chip', rnd(area.left, area.right), rnd(area.top - 30, area.top), {
        vx: rnd(-0.04, 0.04),
        vy: rnd(0.02, 0.12),
        vr: rnd(-0.012, 0.012),
        life: rnd(900, 1500),
        size: rnd(2, 5),
      });
    }
  }

  /** Obláček prachu v jednom místě (kámen o kámen). */
  export function puff(at: Point, count = 14) {
    if (settings.reducedMotion) return;
    for (let k = 0; k < Math.max(1, Math.round(count)); k++) {
      const a = rnd(Math.PI * 0.9, Math.PI * 2.1);
      const v = rnd(0.02, 0.09);
      add('dust', at.x + rnd(-10, 10), at.y + rnd(-4, 4), { vx: Math.cos(a) * v, vy: Math.sin(a) * v * 0.6, life: rnd(600, 1200), size: rnd(1, 2.6) });
    }
    start();
  }

  /** Mechanismus nepovolil: otřes, prach a úlomky ze stropu, okrová vlna. */
  export function fail(at: Point, area: Area) {
    const s = FX.fail;
    showFlash('fail', s);
    if (settings.reducedMotion) return;
    ceiling(area, Math.round(64 * s), Math.round(22 * s));
    add('ring', at.x, at.y, { life: 700, size: 150, tone: 0, amp: s });
    puff(at, 26 * s);
    start();
  }

  /** Krok splněn: vlna světla, stoupající jiskry. */
  export function step(at: Point) {
    showFlash('step');
    if (settings.reducedMotion) return;
    add('ring', at.x, at.y, { life: 800, size: 220, tone: 1 });
    for (let k = 0; k < 26; k++) {
      add('mote', at.x + rnd(-90, 90), at.y + rnd(-20, 20), { vx: rnd(-0.02, 0.02), vy: rnd(-0.05, -0.12), life: rnd(1100, 2000), size: rnd(1.2, 2.6) });
    }
    for (let k = 0; k < 16; k++) {
      const a = rnd(-Math.PI, 0);
      const v = rnd(0.15, 0.4);
      add('spark', at.x, at.y, { vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: rnd(450, 800), size: rnd(1, 2) });
    }
    start();
  }

  /** Komnata otevřena: dunění, kaskáda prachu, záplava světla. */
  export function win(at: Point, area: Area) {
    const s = FX.win;
    showFlash('win', s);
    if (settings.reducedMotion) return;
    ceiling({ left: 0, right: w || window.innerWidth, top: 0 }, Math.round(90 * s), Math.round(26 * s));
    add('ring', at.x, at.y, { life: 1000, size: 300, tone: 1, amp: 0.6 });
    for (let k = 0; k < Math.round(70 * s); k++) {
      add('mote', rnd(area.left, area.right), at.y + rnd(-30, 40), { vx: rnd(-0.03, 0.03), vy: rnd(-0.06, -0.16), life: rnd(1500, 2800), size: rnd(1.2, 3) });
    }
    for (let k = 0; k < Math.round(36 * s); k++) {
      const a = rnd(-Math.PI, 0);
      const v = rnd(0.2, 0.55);
      add('spark', at.x, at.y, { vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: rnd(600, 1100), size: rnd(1, 2.4) });
    }
    start();
  }

  $effect(() => {
    const onResize = () => {
      w = 0;
      if (raf) fit();
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(raf);
      raf = 0;
      parts.length = 0;
    };
  });
</script>

<div class="fx" aria-hidden="true">
  <canvas bind:this={canvas}></canvas>
  {#key flash?.n}
    {#if flash}<div class="flash {flash.kind}" style:--peak={flash.peak}></div>{/if}
  {/key}
</div>

<style>
  .fx {
    position: fixed;
    inset: 0;
    z-index: 6;
    pointer-events: none;
  }
  canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }
  .flash {
    position: absolute;
    inset: 0;
    opacity: 0;
  }
  /* Chyba: pochodně na okamžik zakolísají a okraje zrudnou. */
  .flash.fail {
    background:
      radial-gradient(ellipse at 50% 50%, transparent 25%, rgba(120, 30, 8, 0.65) 100%),
      rgba(12, 4, 0, 0.22);
    animation: flash 750ms ease-out;
  }
  .flash.step {
    background: radial-gradient(ellipse at 50% 55%, rgba(255, 205, 120, 0.22), transparent 60%);
    animation: flash 800ms ease-out;
  }
  .flash.win {
    background: radial-gradient(ellipse at 50% 55%, rgba(255, 215, 140, 0.45), rgba(255, 170, 60, 0.12) 45%, transparent 75%);
    animation: flash 1600ms ease-out;
  }
  @keyframes flash {
    0% {
      opacity: 0;
    }
    15% {
      opacity: var(--peak, 1);
    }
    100% {
      opacity: 0;
    }
  }
</style>
