<script lang="ts">
  import { untrack } from 'svelte';
  import { settings } from '../game/settings.svelte.ts';

  type WeightState = 'hidden' | 'unknown' | 'known';

  interface Props {
    on: boolean;
    weight: number;
    weightState: WeightState;
    /** Relativní velikost (velikost naznačuje váhu). */
    scale?: number;
    digit?: boolean;
    highlight?: boolean;
    disabled?: boolean;
    celebrate?: boolean;
    delay?: number;
    label: string;
    onToggle: () => void;
  }

  let {
    on,
    weight,
    weightState,
    scale = 1,
    digit = false,
    highlight = false,
    disabled = false,
    celebrate = false,
    delay = 0,
    label,
    onToggle,
  }: Props = $props();

  const OUTER = '50,4 94,46 94,114 50,156 6,114 6,46';
  const DUST = Array.from({ length: 7 }, (_, k) => {
    const a = Math.PI * (0.08 + (0.84 * k) / 6);
    return { dx: Math.cos(a) * 46, dy: -Math.sin(a) * 18 - 4, s: 2 + (k % 3) };
  });

  let wrap: HTMLElement | undefined = $state();
  let presses = $state(0);
  let mounted = false;

  // Krystal se při přepnutí zasune do kamenného lůžka a zvíří prach.
  $effect(() => {
    void on;
    untrack(() => {
      if (!mounted) {
        mounted = true;
        return;
      }
      presses++;
      if (!settings.reducedMotion && wrap) {
        wrap.animate(
          [{ transform: 'translateY(0)' }, { transform: 'translateY(6px)' }, { transform: 'translateY(0)' }],
          { duration: 280, easing: 'cubic-bezier(.3,.7,.4,1)' },
        );
      }
    });
  });
</script>

<button
  type="button"
  class="crystal"
  class:on
  class:highlight
  class:celebrate
  style:--s={scale}
  style:--d="{delay}ms"
  aria-pressed={on}
  aria-label={label}
  {disabled}
  onclick={onToggle}
>
  <span class="gem-wrap" bind:this={wrap}>
    {#if celebrate && on}<span class="beam" aria-hidden="true"></span>{/if}
    <span class="halo" aria-hidden="true"></span>
    {#if highlight}<span class="ring" aria-hidden="true"></span>{/if}
    <svg class="gem" viewBox="0 0 100 160" aria-hidden="true" focusable="false">
      <polygon class="body off" points={OUTER} />
      <polygon class="body lit" points={OUTER} />
      <polygon class="face" points="50,28 72,54 72,106 50,132 28,106 28,54" />
      <path class="facets" d="M50 4V28M94 46L72 54M94 114L72 106M50 156V132M6 114L28 106M6 46L28 54" />
      <ellipse class="core" cx="50" cy="72" rx="10" ry="22" />
      <polygon class="outline" points={OUTER} />
    </svg>
    <span class="burst" aria-hidden="true"></span>
  </span>

  <span class="plinth" aria-hidden="true">
    <svg viewBox="0 0 120 50" focusable="false">
      <path class="front" d="M8 14 V34 Q60 52 112 34 V14 Q60 32 8 14Z" />
      <ellipse class="top" cx="60" cy="14" rx="52" ry="11" />
      <ellipse class="pool" cx="60" cy="14" rx="46" ry="9" />
      <ellipse class="hole" cx="60" cy="13" rx="20" ry="4.5" />
      <path class="groove" d="M10 24 Q60 40 110 24" />
      <path class="prong" d="M40 14 L45 1 L50 15Z M70 15 L75 1 L80 14Z" />
    </svg>
    {#key presses}
      {#if presses > 0}
        <span class="dust">
          {#each DUST as p, k (k)}
            <i style:--dx="{p.dx}px" style:--dy="{p.dy}px" style:--sz="{p.s}px"></i>
          {/each}
        </span>
      {/if}
    {/key}
  </span>

  <span class="meta" aria-hidden="true">
    {#if weightState !== 'hidden'}
      {#key weightState}
        <span class="weight" class:unknown={weightState === 'unknown'}>{weightState === 'known' ? weight : '?'}</span>
      {/key}
    {/if}
    {#if digit}<span class="digit carved">{on ? '1' : '0'}</span>{/if}
  </span>
</button>

<style>
  .crystal {
    --w: calc(var(--crystal-w) * var(--s));
    position: relative;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    min-width: 44px;
    padding: 10px 4px 4px;
    border: 0;
    border-radius: 10px;
    background: none;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }
  .crystal:disabled {
    cursor: default;
  }
  .gem-wrap {
    position: relative;
    z-index: 1;
    display: block;
    width: var(--w);
    aspect-ratio: 100 / 160;
    transition: transform var(--t-med) ease;
  }
  .gem {
    position: relative;
    display: block;
    width: 100%;
    height: 100%;
    overflow: visible;
    transition: filter var(--t-med) ease;
  }

  /* Světlo, které krystal vrhá na okolní kámen. */
  .halo {
    position: absolute;
    inset: -45% -80%;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255, 200, 110, 0.5), rgba(255, 160, 60, 0.16) 40%, transparent 68%);
    mix-blend-mode: screen;
    opacity: 0;
    transition: opacity var(--t-slow) ease;
    pointer-events: none;
  }
  .on .halo {
    opacity: 1;
  }

  .body.off {
    fill: url(#gem-off);
  }
  .body.lit {
    fill: url(#gem-on);
    opacity: 0;
    transition: opacity var(--t-fast) ease-out;
  }
  .face {
    fill: none;
    stroke: var(--umbra);
    stroke-opacity: 0.4;
    stroke-width: 1.5;
  }
  .facets {
    fill: none;
    stroke: var(--umbra);
    stroke-opacity: 0.3;
    stroke-width: 1.5;
  }
  .core {
    fill: url(#gem-core);
    opacity: 0;
    transition: opacity var(--t-med);
  }
  .outline {
    fill: none;
    stroke: var(--umbra);
    stroke-width: 3;
    stroke-linejoin: round;
    transition: stroke var(--t-fast);
  }
  .on .body.lit {
    opacity: 1;
  }
  .on .face {
    stroke: #fff6dc;
    stroke-opacity: 0.7;
  }
  .on .facets {
    stroke: #fff6dc;
    stroke-opacity: 0.5;
  }
  .on .core {
    opacity: 0.9;
    animation: breathe 3.2s ease-in-out infinite;
  }
  .on .outline {
    stroke: #ffe9b0;
  }
  .on .gem {
    filter: drop-shadow(0 0 10px rgba(255, 210, 130, 0.6)) drop-shadow(0 0 28px rgba(242, 170, 70, 0.35));
  }

  .crystal:not(:disabled):hover .gem-wrap {
    transform: translateY(-4px);
  }
  .crystal:not(:disabled):hover .outline {
    stroke: #b4aac8;
  }
  .crystal.on:not(:disabled):hover .outline {
    stroke: #fff3d1;
  }

  .burst {
    position: absolute;
    inset: -25%;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255, 233, 176, 0.6), transparent 60%);
    opacity: 0;
    pointer-events: none;
  }
  .on .burst {
    animation: burst 520ms ease-out;
  }

  .ring {
    position: absolute;
    inset: -10% -28%;
    border: 2px solid var(--ok);
    border-radius: 50%;
    box-shadow: 0 0 14px rgba(127, 207, 180, 0.35);
    opacity: 0.95;
    pointer-events: none;
    animation: ring 1.6s ease-in-out infinite;
  }

  .celebrate .gem-wrap {
    animation: rise 900ms ease-out var(--d) both;
  }
  /* Komnata otevřena: z rozsvíceného krystalu vyšlehne slabý sloup světla ke stropu. */
  .beam {
    position: absolute;
    left: 50%;
    bottom: 40%;
    z-index: -1;
    width: 70%;
    height: 340%;
    transform-origin: 50% 100%;
    transform: translateX(-50%) scaleY(0);
    background: linear-gradient(0deg, rgba(255, 226, 160, 0.85), rgba(255, 200, 110, 0.35) 45%, transparent);
    filter: blur(3px);
    mix-blend-mode: screen;
    pointer-events: none;
    animation: beam 1500ms ease-out var(--d) both;
  }

  /* Kamenný podstavec s bronzovými drápky. */
  .plinth {
    position: relative;
    z-index: 2;
    display: block;
    width: calc(var(--w) * 1.25);
    margin-top: calc(var(--w) * -0.2);
  }
  .plinth svg {
    display: block;
    width: 100%;
    height: auto;
    overflow: visible;
  }
  .plinth .front {
    fill: url(#plinth-front);
    stroke: rgba(0, 0, 0, 0.6);
    stroke-width: 1;
  }
  .plinth .top {
    fill: url(#plinth-top);
    stroke: rgba(0, 0, 0, 0.5);
    stroke-width: 1;
  }
  .plinth .pool {
    fill: url(#light-pool);
    opacity: 0;
    transition: opacity var(--t-slow) ease;
  }
  .on .plinth .pool {
    opacity: 0.85;
  }
  .plinth .hole {
    fill: #0d0a07;
  }
  .plinth .groove {
    fill: none;
    stroke: rgba(0, 0, 0, 0.45);
    stroke-width: 1.5;
  }
  .plinth .prong {
    fill: url(#bronze);
    stroke: #3d2c0c;
    stroke-width: 0.8;
  }

  .dust {
    position: absolute;
    left: 50%;
    top: 22%;
    pointer-events: none;
  }
  .dust i {
    position: absolute;
    width: var(--sz);
    height: var(--sz);
    border-radius: 50%;
    background: rgba(214, 190, 150, 0.75);
    animation: dust 650ms ease-out forwards;
  }

  .meta {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    min-height: 1.5em;
    margin-top: 6px;
    font-family: var(--font-mono);
    line-height: 1.2;
  }
  /* Mosazná destička s váhou; pod ní vytesaný stav bitu. */
  .weight {
    min-width: 2.3em;
    padding: 1px 8px;
    border: 1px solid #5c4214;
    border-radius: 3px;
    background: linear-gradient(180deg, #f3d995 0%, #d4ad55 45%, #a8822f 100%);
    box-shadow:
      inset 0 1px 0 rgba(255, 250, 220, 0.7),
      0 2px 3px rgba(0, 0, 0, 0.5);
    font-size: var(--fs-sm);
    font-weight: 700;
    text-align: center;
    color: var(--lumen-ink);
    animation: engrave 700ms ease-out;
  }
  .weight.unknown {
    border-color: rgba(0, 0, 0, 0.6);
    background: var(--stone-700);
    box-shadow:
      inset 0 2px 4px rgba(0, 0, 0, 0.6),
      0 1px 0 rgba(255, 236, 200, 0.08);
    color: var(--umbra);
    animation: none;
  }
  .digit {
    font-size: var(--fs-base);
    font-weight: 700;
    color: var(--text-muted);
  }
  .on .digit {
    color: var(--lumen-glow);
  }

  @keyframes beam {
    0% {
      transform: translateX(-50%) scaleY(0);
      opacity: 0;
    }
    25% {
      transform: translateX(-50%) scaleY(1);
      opacity: 0.35;
    }
    100% {
      transform: translateX(-50%) scaleY(1.1);
      opacity: 0;
    }
  }
  @keyframes breathe {
    50% {
      opacity: 0.55;
    }
  }
  @keyframes burst {
    from {
      opacity: 1;
      transform: scale(0.6);
    }
    to {
      opacity: 0;
      transform: scale(1.3);
    }
  }
  @keyframes ring {
    0%,
    100% {
      transform: scale(1);
      opacity: 0.95;
    }
    50% {
      transform: scale(1.06);
      opacity: 0.5;
    }
  }
  @keyframes engrave {
    from {
      opacity: 0;
      transform: scale(1.6) rotate(-4deg);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  @keyframes rise {
    0%,
    100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-12px);
    }
  }
  @keyframes dust {
    from {
      opacity: 0.9;
      transform: translate(0, 0) scale(1);
    }
    to {
      opacity: 0;
      transform: translate(var(--dx), var(--dy)) scale(0.4);
    }
  }
</style>
