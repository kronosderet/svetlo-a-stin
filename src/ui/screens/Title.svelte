<script lang="ts">
  import Icon from '../Icon.svelte';
  import ProgressFile from '../ProgressFile.svelte';
  import { go, ui } from '../../game/nav.svelte.ts';
  import { hasStarted } from '../../game/progress.svelte.ts';
  import { install, pwa } from '../../game/pwa.svelte.ts';
  import { AUTHOR, LICENSE_NAME, YEAR } from '../../content/about';
  import { playDoor, unlock } from '../../audio/sound';

  const started = $derived(hasStarted());
  const ticks = Array.from({ length: 32 }, (_, k) => k * 11.25);

  function enter() {
    unlock();
    playDoor();
    go(started ? { name: 'map' } : { name: 'level', id: 'I-1' });
  }
</script>

{#snippet torch(side: 'left' | 'right')}
  <div class="torch {side}" aria-hidden="true">
    <span class="glow"></span>
    <svg viewBox="0 0 60 200" focusable="false">
      <defs>
        <radialGradient id="flame-{side}" cx="50%" cy="70%" r="60%">
          <stop offset="0" stop-color="#fff6d8" />
          <stop offset="0.35" stop-color="#ffd27a" />
          <stop offset="0.7" stop-color="#ff8a2a" />
          <stop offset="1" stop-color="#c2410c" stop-opacity="0" />
        </radialGradient>
      </defs>
      <g class="flame">
        <path d="M30 4 C44 30 50 46 44 62 C40 74 20 74 16 62 C10 46 18 28 30 4Z" fill="url(#flame-{side})" />
        <path class="inner" d="M30 30 C37 44 39 52 36 60 C33 67 27 67 24 60 C21 52 24 42 30 30Z" fill="#fff3cf" />
      </g>
      <!-- košík a držák -->
      <path d="M14 66 H46 L40 84 H20 Z" class="iron" />
      <path d="M16 70 H44 M18 76 H42" class="iron-line" />
      <rect x="26" y="84" width="8" height="70" class="wood-handle" />
      <path d="M8 150 H52 L48 160 H12 Z" class="iron" />
      <rect x="22" y="160" width="16" height="30" class="iron" />
    </svg>
  </div>
{/snippet}

<div class="title-screen">
  {@render torch('left')}
  {@render torch('right')}

  <div class="emblem stone" aria-hidden="true">
    <svg viewBox="-120 -120 240 240">
      <circle r="108" class="groove" />
      <circle r="94" class="groove" />
      {#each ticks as deg (deg)}
        <line x1="0" y1="-108" x2="0" y2={deg % 45 === 0 ? -94 : -101} transform="rotate({deg})" />
      {/each}
      <ellipse cx="0" cy="66" rx="70" ry="12" class="socket" />
      <g transform="translate(-26 -4)">
        <polygon class="lit" points="0,-62 30,-30 30,30 0,62 -30,30 -30,-30" />
        <polygon class="facet" points="0,-44 16,-24 16,24 0,44 -16,24 -16,-24" />
      </g>
      <g transform="translate(26 -4)">
        <polygon class="dark" points="0,-62 30,-30 30,30 0,62 -30,30 -30,-30" />
        <polygon class="facet dim" points="0,-44 16,-24 16,24 0,44 -16,24 -16,-24" />
      </g>
    </svg>
  </div>

  <p class="eyebrow carved">Kodex zapomenuté říše</p>
  <h1 class="logo">
    <span class="light">Světlo</span>
    <span class="amp">&amp;</span>
    <span class="shade">Stín</span>
  </h1>
  <p class="tagline carved">
    Lumenité znali jen dva stavy: světlo a stín. Postavili z nich celou svou vědu. Pak záhadně zmizeli.
  </p>

  <div class="cta">
    <button type="button" class="btn btn-primary btn-lg" onclick={enter}>
      {started ? 'Pokračovat' : 'Vstoupit do observatoře'}
    </button>
    <!-- Na jiném počítači: pokračovat tam, kde hráč skončil (soubor třeba ze školního OneDrive). -->
    <ProgressFile compact />
  </div>

  <footer class="foot">
    <div class="foot-row">
      <button type="button" class="icon-btn" onclick={() => (ui.settingsOpen = true)} aria-label="Nastavení" title="Nastavení">
        <Icon name="settings" />
      </button>
      <span class="carved">Prototyp · Akty I až IV, 64 komnat</span>
      {#if pwa.canInstall && !pwa.installed}
        <button type="button" class="btn btn-ghost install" onclick={install}>
          <Icon name="install" size={18} /> Nainstalovat hru
        </button>
      {/if}
    </div>
    <p class="credit carved">© {YEAR} {AUTHOR} ve spolupráci s Claude · {LICENSE_NAME}</p>
  </footer>
</div>

<style>
  .title-screen {
    position: relative;
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 14px;
    padding: 32px 16px 112px;
    text-align: center;
  }
  /* Patička se na telefonu zalomí do dvou řádků (s tlačítkem instalace). */
  @media (max-width: 520px) {
    .title-screen {
      padding-bottom: 156px;
    }
  }

  /* Vytesaný kámen se dvěma krystaly */
  .emblem {
    width: clamp(160px, 26vw, 220px);
    aspect-ratio: 1;
    border-radius: 50%;
  }
  .emblem svg {
    width: 100%;
    height: 100%;
    overflow: visible;
  }
  .groove,
  line {
    fill: none;
    stroke: rgba(0, 0, 0, 0.55);
    stroke-width: 2.2;
  }
  .socket {
    fill: rgba(0, 0, 0, 0.45);
  }
  .lit {
    fill: url(#gem-on);
    stroke: #ffe9b0;
    stroke-width: 2.5;
    filter: drop-shadow(0 0 16px rgba(255, 200, 110, 0.7));
  }
  .dark {
    fill: url(#gem-off);
    stroke: var(--umbra);
    stroke-width: 2.5;
  }
  .facet {
    fill: none;
    stroke: #fff6dc;
    stroke-opacity: 0.7;
    stroke-width: 1.2;
  }
  .facet.dim {
    stroke: var(--umbra);
    stroke-opacity: 0.5;
  }

  .logo {
    margin: 0;
    font-size: clamp(2.6rem, 9vw, 5.8rem);
    font-weight: 700;
    letter-spacing: 0.06em;
    line-height: 1;
  }
  .light {
    background: linear-gradient(180deg, #fff1c4 10%, #f2c14e 55%, #a8741a 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    filter: drop-shadow(0 3px 0 rgba(0, 0, 0, 0.7)) drop-shadow(0 0 20px rgba(242, 170, 70, 0.35));
  }
  .amp {
    font-family: var(--font-serif);
    font-style: italic;
    font-weight: 500;
    color: var(--stone-200);
    text-shadow: 0 2px 0 rgba(0, 0, 0, 0.7);
  }
  /* Stín: vytesaný do kamene, bez světla */
  .shade {
    color: #9a8a72;
    text-shadow:
      0 -2px 0 rgba(0, 0, 0, 0.8),
      0 2px 0 rgba(255, 236, 200, 0.18);
  }
  .tagline {
    max-width: 34rem;
    margin: 6px 0 18px;
    font-size: var(--fs-lg);
    color: var(--text-muted);
  }

  /* Pochodně */
  .torch {
    position: absolute;
    top: 50%;
    width: clamp(46px, 6vw, 70px);
    transform: translateY(-62%);
  }
  .torch.left {
    left: clamp(12px, 9vw, 140px);
  }
  .torch.right {
    right: clamp(12px, 9vw, 140px);
  }
  .torch svg {
    position: relative;
    display: block;
    width: 100%;
    height: auto;
    overflow: visible;
  }
  .glow {
    position: absolute;
    left: 50%;
    top: 14%;
    width: 520%;
    aspect-ratio: 1;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    background: radial-gradient(circle, rgba(255, 170, 80, 0.32), rgba(255, 120, 40, 0.1) 35%, transparent 65%);
    animation: glow 2.9s ease-in-out infinite;
  }
  .right .glow {
    animation-duration: 3.4s;
    animation-delay: -1s;
  }
  .flame {
    transform-box: fill-box;
    transform-origin: 50% 100%;
    animation: flame 1.3s ease-in-out infinite alternate;
  }
  .right .flame {
    animation-duration: 1.1s;
    animation-delay: -0.4s;
  }
  .flame .inner {
    opacity: 0.85;
  }
  .iron {
    fill: #2a221c;
    stroke: #0e0a07;
    stroke-width: 1.5;
  }
  .iron-line {
    fill: none;
    stroke: #4d4134;
    stroke-width: 1.5;
  }
  .wood-handle {
    fill: #5a3a20;
    stroke: #1d1209;
    stroke-width: 1.2;
  }

  /* Na konci stránky, ne přes ni: na nízkých obrazovkách by jinak zakryla tlačítka. */
  .foot {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    padding: 10px 16px 12px;
    font-size: var(--fs-sm);
    color: var(--text-muted);
  }
  .foot-row {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 8px;
  }
  .credit {
    margin: 0;
    font-size: var(--fs-xs);
    opacity: 0.8;
  }

  .install {
    min-height: 36px;
    padding: 4px 12px;
    font-size: var(--fs-sm);
  }

  @keyframes flame {
    0% {
      transform: scale(1, 1) skewX(0deg);
    }
    35% {
      transform: scale(0.94, 1.06) skewX(-3deg);
    }
    70% {
      transform: scale(1.04, 0.95) skewX(2deg);
    }
    100% {
      transform: scale(0.97, 1.08) skewX(-1deg);
    }
  }
  @keyframes glow {
    0%,
    100% {
      opacity: 0.9;
    }
    40% {
      opacity: 0.78;
    }
    70% {
      opacity: 1;
    }
  }

  /* Na užších obrazovkách pochodně visí výš, aby nezakrývaly název. */
  @media (max-width: 1100px) {
    .torch {
      top: clamp(40px, 12vh, 120px);
      transform: none;
      width: clamp(38px, 6vw, 56px);
    }
  }
</style>
