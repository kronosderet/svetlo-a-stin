<script lang="ts">
  import { fade } from 'svelte/transition';
  import { settings } from '../game/settings.svelte.ts';

  interface Props {
    /** Požadované číslo; null = hotovo (✓). */
    value: number | null;
    /** Pootočení kamenného kola ve stupních. */
    turn?: number;
    label: string;
  }

  let { value, turn = 0, label }: Props = $props();

  const m = $derived(settings.reducedMotion ? 0 : 1);
  const ticks = Array.from({ length: 24 }, (_, k) => k * 15);
</script>

<!-- Kamenné kolo s bronzovými hřeby a vykládaným číslem. -->
<div class="demand">
  <span class="demand-label carved">{label}</span>
  <span class="disc stone">
    <svg class="disc-ring" viewBox="-80 -80 160 160" style:transform="rotate({turn}deg)" aria-hidden="true">
      <circle r="74" class="groove" />
      {#each ticks as deg (deg)}
        <line x1="0" y1="-74" x2="0" y2={deg % 45 === 0 ? -62 : -67} transform="rotate({deg})" />
      {/each}
      {#each [0, 90, 180, 270] as deg (deg)}
        <rect x="-4" y="-79" width="8" height="8" transform="rotate({deg + 45})" class="stud" />
      {/each}
    </svg>
    <span class="disc-face stone-inset">
      {#key value}
        <span class="value inlaid" class:long={value !== null && value >= 100} in:fade={{ duration: 300 * m, delay: 250 * m }}>
          {#if value === null}<svg class="check" viewBox="0 0 24 24" aria-label="hotovo" role="img"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>{:else}{value}{/if}
        </span>
      {/key}
    </span>
  </span>
</div>

<style>
  .demand {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }
  .demand-label {
    font-family: var(--font-display);
    font-size: var(--fs-xs);
    font-weight: 700;
    letter-spacing: var(--ls-label);
    text-transform: uppercase;
    color: var(--text-muted);
  }
  .disc {
    position: relative;
    display: grid;
    place-items: center;
    width: min(clamp(118px, 20vw, 152px), 16vh);
    min-width: 96px;
    aspect-ratio: 1;
    border-radius: 50%;
  }
  .disc-ring {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    transition: transform 1100ms var(--heavy);
  }
  .disc-ring .groove {
    fill: none;
    stroke: rgba(0, 0, 0, 0.5);
    stroke-width: 2;
  }
  .disc-ring line {
    stroke: rgba(0, 0, 0, 0.55);
    stroke-width: 2.2;
  }
  .disc-ring .stud {
    fill: url(#bronze);
    stroke: #3d2c0c;
    stroke-width: 0.8;
  }
  .disc-face {
    display: grid;
    place-items: center;
    width: 64%;
    aspect-ratio: 1;
    border-radius: 50%;
  }
  .value {
    grid-area: 1 / 1;
    font-family: var(--font-display);
    font-weight: 700;
    font-size: min(clamp(2.4rem, 6vw, 3.4rem), 5.6vh);
    line-height: 1;
  }
  .check {
    width: 0.9em;
    height: 0.9em;
    fill: none;
    stroke: currentColor;
    stroke-width: 3;
    stroke-linecap: round;
    stroke-linejoin: round;
    vertical-align: -0.1em;
  }
  .value.long {
    font-size: min(clamp(1.7rem, 4.4vw, 2.5rem), 4.2vh);
  }
</style>
