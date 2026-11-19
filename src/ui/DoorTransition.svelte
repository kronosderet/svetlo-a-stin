<script lang="ts">
  import { onMount } from 'svelte';
  import { doors, doorsPassKey } from '../game/doors.svelte.ts';

  /**
   * Kamenné dveře přes celou hru: zavřou se nad vítěznou deskou, za nimi se načte další komnata
   * a pak se do ní se skřípěním rozjedou. Zavřené dveře zachytí kliknutí i klávesy, otevírající
   * propustí kliknutí a nové stisky (podržená klávesa ne, viz doorsPassKey).
   */
  onMount(() => {
    // Ve fázi zachytávání na window: klávesa se nedostane k tlačítkům ani k žádnému onkeydown ve hře.
    const block = (e: KeyboardEvent) => {
      if (doorsPassKey(doors.phase, e.repeat)) return;
      e.preventDefault();
      e.stopImmediatePropagation();
    };
    window.addEventListener('keydown', block, true);
    return () => window.removeEventListener('keydown', block, true);
  });
</script>

{#if doors.phase !== 'idle'}
  {#key doors.run}
    <div class="doors" class:opening={doors.phase === 'opening'} aria-hidden="true">
      {#if doors.phase === 'opening'}<div class="rays"></div>{/if}
      <div class="door left"><span class="seam-glyph"></span></div>
      <div class="door right"><span class="seam-glyph"></span></div>
    </div>
  {/key}
{/if}

<style>
  .doors {
    position: fixed;
    inset: 0;
    z-index: 80;
    display: flex;
    overflow: hidden;
    pointer-events: auto;
  }
  .doors.opening {
    pointer-events: none;
    animation: rumble 0.45s linear both;
  }
  .door {
    position: relative;
    z-index: 1;
    flex: 1;
    background-color: #4a3d30;
    background-image: var(--tex-grain), var(--tex-masonry), var(--tex-mottle), var(--tex-relief);
    background-size:
      240px 240px,
      520px 260px,
      700px 700px,
      512px 512px;
    background-blend-mode: normal, normal, normal, overlay;
    box-shadow: inset 0 0 120px rgba(0, 0, 0, 0.6);
  }
  /* Zavírání: obě poloviny přijedou od krajů (délka = DOOR_CLOSE_MS). */
  .door.left {
    border-right: 3px solid #120d08;
    animation: close-left 480ms var(--heavy) both;
  }
  .door.right {
    border-left: 2px solid rgba(255, 226, 180, 0.12);
    background-position: right top;
    animation: close-right 480ms var(--heavy) both;
  }
  /* Otevírání do nové obrazovky (délka i se zpožděním = DOOR_OPEN_MS). */
  .opening .door.left {
    animation: open-left 1.15s var(--heavy) both 0.15s;
  }
  .opening .door.right {
    animation: open-right 1.15s var(--heavy) both 0.15s;
  }
  /* Polovina vytesaného krystalu přes spáru dveří */
  .seam-glyph {
    position: absolute;
    top: 50%;
    width: 70px;
    height: 112px;
    margin-top: -56px;
    background: linear-gradient(135deg, #fff1c4, #f2c14e 50%, #b07a1a);
    clip-path: polygon(50% 0, 100% 26%, 100% 74%, 50% 100%, 0 74%, 0 26%);
    filter: drop-shadow(0 0 18px rgba(242, 193, 78, 0.8));
  }
  .left .seam-glyph {
    right: -35px;
    clip-path: polygon(50% 0, 50% 100%, 0 74%, 0 26%);
  }
  .right .seam-glyph {
    left: -35px;
    clip-path: polygon(50% 0, 100% 26%, 100% 74%, 50% 100%);
  }
  /* Světlo nové komnaty, které se vyvalí spárou */
  .rays {
    position: fixed;
    left: 50%;
    top: 50%;
    z-index: 0;
    width: 160vmax;
    height: 160vmax;
    transform: translate(-50%, -50%);
    background:
      radial-gradient(circle, rgba(255, 200, 110, 0.35), rgba(255, 160, 60, 0.1) 30%, transparent 55%),
      repeating-conic-gradient(from 0deg, rgba(255, 210, 140, 0.08) 0deg 6deg, transparent 6deg 18deg);
    mask-image: radial-gradient(circle, #000 0%, transparent 55%);
    animation: rays-out 1.3s ease-out both;
  }

  @keyframes close-left {
    from {
      transform: translateX(-102%);
    }
    to {
      transform: translateX(0);
    }
  }
  @keyframes close-right {
    from {
      transform: translateX(102%);
    }
    to {
      transform: translateX(0);
    }
  }
  @keyframes open-left {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(-102%);
    }
  }
  @keyframes open-right {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(102%);
    }
  }
  @keyframes rumble {
    0%,
    100% {
      transform: translate(0, 0);
    }
    20% {
      transform: translate(-2px, 1px);
    }
    40% {
      transform: translate(2px, -1px);
    }
    60% {
      transform: translate(-1px, 1px);
    }
    80% {
      transform: translate(1px, 0);
    }
  }
  @keyframes rays-out {
    0% {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.6);
    }
    35% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: translate(-50%, -50%) scale(1.1);
    }
  }
</style>
