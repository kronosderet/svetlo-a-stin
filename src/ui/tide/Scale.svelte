<script lang="ts">
  import { Tween } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
  import { settings } from '../../game/settings.svelte.ts';

  /** Váhy Osudu: vlevo miska Osudu s požadovanou váhou, vpravo hráčovo světlo. */
  let { target, value }: { target: number | null; value: number } = $props();

  const W = 360;
  const CX = W / 2;
  const CY = 46;
  const ARM = 122;
  const DROP = 62;

  const tilt = new Tween(0, { duration: 700, easing: cubicOut });

  const goal = $derived(target ?? value);
  const balanced = $derived(goal === value);

  $effect(() => {
    // Těžší miska klesne. Náklon roste s rozdílem, ale jen do 13°.
    const diff = value - goal;
    tilt.set(Math.max(-1, Math.min(1, diff / 12)) * 13, { duration: settings.reducedMotion ? 0 : 700 });
  });

  const a = $derived((tilt.current * Math.PI) / 180);
  const left = $derived({ x: CX - ARM * Math.cos(a), y: CY - ARM * Math.sin(a) });
  const right = $derived({ x: CX + ARM * Math.cos(a), y: CY + ARM * Math.sin(a) });

  const verdict = $derived(balanced ? 'vyrovnáno' : value > goal ? 'tvé světlo je těžší' : 'tvé světlo je lehčí');
</script>

<div class="scale" class:balanced role="img" aria-label="Váhy: Osud žádá {goal}, tvé světlo váží {value}, {verdict}">
  <svg viewBox="0 0 {W} 178" aria-hidden="true" focusable="false">
    <!-- podstavec a sloup -->
    <path class="base" d="M{CX - 54} 172 L{CX + 54} 172 L{CX + 34} 156 L{CX - 34} 156Z" />
    <rect class="post" x={CX - 6} y={CY} width="12" height="112" />
    <!-- rameno -->
    <line class="beam" x1={left.x} y1={left.y} x2={right.x} y2={right.y} />
    <circle class="pivot" cx={CX} cy={CY} r="9" />
    <path class="pointer" d="M{CX} {CY - 30} L{CX - 6} {CY - 12} L{CX + 6} {CY - 12}Z" transform="rotate({tilt.current} {CX} {CY})" />

    {#each [{ end: left, kind: 'fate' }, { end: right, kind: 'mine' }] as pan (pan.kind)}
      <g class="pan {pan.kind}">
        <line class="chain" x1={pan.end.x} y1={pan.end.y} x2={pan.end.x - 34} y2={pan.end.y + DROP} />
        <line class="chain" x1={pan.end.x} y1={pan.end.y} x2={pan.end.x + 34} y2={pan.end.y + DROP} />
        <path class="dish" d="M{pan.end.x - 44} {pan.end.y + DROP} Q{pan.end.x} {pan.end.y + DROP + 22} {pan.end.x + 44} {pan.end.y + DROP}Z" />
        {#if pan.kind === 'fate'}
          <rect class="weight" x={pan.end.x - 24} y={pan.end.y + DROP - 30} width="48" height="30" rx="4" />
          {#if target === null}
            <path class="tick" d="M{pan.end.x - 8} {pan.end.y + DROP - 15} l5 5 l10 -11" />
          {:else}
            <text class="num fate-num" x={pan.end.x} y={pan.end.y + DROP - 8}>{target}</text>
          {/if}
        {:else}
          <circle class="orb" cx={pan.end.x} cy={pan.end.y + DROP - 16} r="17" />
          <text class="num mine-num" x={pan.end.x} y={pan.end.y + DROP - 9}>{value}</text>
        {/if}
      </g>
    {/each}
  </svg>
  <div class="labels" aria-hidden="true">
    <span class="carved">Osud žádá</span>
    <span class="carved">Tvé světlo</span>
  </div>
</div>

<style>
  .scale {
    width: min(100%, 380px, 46vh);
  }
  svg {
    display: block;
    width: 100%;
    height: auto;
    overflow: visible;
  }
  .base {
    fill: url(#plinth-front);
    stroke: rgba(0, 0, 0, 0.6);
  }
  .post {
    fill: url(#bronze);
    stroke: #3d2c0c;
    stroke-width: 1;
  }
  .beam {
    stroke: #b08a3a;
    stroke-width: 9;
    stroke-linecap: round;
    filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.6));
  }
  .pivot {
    fill: #d4ad55;
    stroke: #3d2c0c;
    stroke-width: 2;
  }
  .pointer {
    fill: #ecd08a;
    stroke: #5c4214;
  }
  .chain {
    stroke: #8a6a2a;
    stroke-width: 1.6;
    stroke-dasharray: 3 2;
  }
  .dish {
    fill: url(#bronze);
    stroke: #3d2c0c;
    stroke-width: 1.2;
  }
  .weight {
    fill: url(#plinth-top);
    stroke: rgba(0, 0, 0, 0.7);
    stroke-width: 1.2;
  }
  .orb {
    fill: url(#gem-on);
    stroke: #ffe9b0;
    stroke-width: 1.5;
    filter: drop-shadow(0 0 8px rgba(255, 210, 130, 0.75));
  }
  .num {
    font-family: var(--font-display);
    font-weight: 700;
    text-anchor: middle;
  }
  .fate-num {
    font-size: 18px;
    fill: var(--text);
  }
  .tick {
    fill: none;
    stroke: var(--lumen-glow);
    stroke-width: 3;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  .mine-num {
    font-size: 18px;
    fill: var(--lumen-ink);
  }
  .balanced .beam {
    stroke: #ecd08a;
    filter: drop-shadow(0 0 8px rgba(255, 210, 130, 0.7));
  }
  .labels {
    display: flex;
    justify-content: space-between;
    padding: 0 6%;
    margin-top: -4px;
    font-family: var(--font-display);
    font-size: var(--fs-xs);
    font-weight: 700;
    letter-spacing: var(--ls-label);
    text-transform: uppercase;
    color: var(--stone-200);
  }
</style>
