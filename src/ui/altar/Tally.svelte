<script lang="ts">
  /**
   * Kamenná deska s čárkami poutníků (po pěti, pátá škrtá čtveřici).
   * Čekající poutník je světelný obrys čárky, která se teprve vyryje.
   */
  let { count, pending }: { count: number; pending: boolean } = $props();

  const GROUP = 58;

  interface Mark {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  }

  function mark(j: number): Mark {
    const x0 = Math.floor(j / 5) * GROUP + 8;
    const p = j % 5;
    if (p === 4) return { x1: x0 - 4, y1: 46, x2: x0 + 40, y2: 12 };
    return { x1: x0 + 3 + p * 11, y1: 8, x2: x0 + 3 + p * 11, y2: 50 };
  }

  const total = $derived(count + (pending ? 1 : 0));
  const marks = $derived(Array.from({ length: count }, (_, j) => j));
  const width = $derived(Math.max(1, Math.ceil(total / 5)) * GROUP + 4);
  const ghost = $derived(pending ? mark(count) : null);
</script>

<div class="tally stone" role="img" aria-label="Poutníků: {count}{pending ? ', přichází další' : ''}">
  <span class="label carved">Poutníci</span>
  <span class="slab stone-inset">
    <svg viewBox="0 0 {width} 58" style:width="{width * 1.3}px" aria-hidden="true">
      {#each marks as j (j)}
        {@const k = mark(j)}
        <g class="mark">
          <line class="lip" x1={k.x1 + 1.5} y1={k.y1 + 1.5} x2={k.x2 + 1.5} y2={k.y2 + 1.5} />
          <line class="cut" x1={k.x1} y1={k.y1} x2={k.x2} y2={k.y2} pathLength="1" />
        </g>
      {/each}
      {#if ghost}
        <line class="ghost" x1={ghost.x1} y1={ghost.y1} x2={ghost.x2} y2={ghost.y2} />
      {/if}
    </svg>
  </span>
  <span class="caption carved">{pending ? 'přichází další poutník' : 'všichni sečteni'}</span>
</div>

<style>
  .tally {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 10px 18px 12px;
  }
  .label {
    font-family: var(--font-display);
    font-size: var(--fs-xs);
    font-weight: 700;
    letter-spacing: var(--ls-label);
    text-transform: uppercase;
    color: var(--stone-200);
  }
  .slab {
    display: grid;
    place-items: center;
    min-width: 150px;
    min-height: 80px;
    padding: 10px 18px;
  }
  svg {
    display: block;
    max-width: 100%;
    height: auto;
    overflow: visible;
  }
  .lip {
    stroke: rgba(255, 236, 200, 0.16);
    stroke-width: 4;
    stroke-linecap: round;
  }
  .cut {
    stroke: #120d08;
    stroke-width: 4.5;
    stroke-linecap: round;
    stroke-dasharray: 1;
    animation: carve 420ms ease-out both;
  }
  .ghost {
    stroke: var(--lumen);
    stroke-width: 3;
    stroke-linecap: round;
    stroke-dasharray: 3 5;
    filter: drop-shadow(0 0 4px rgba(242, 193, 78, 0.8));
    animation: wait 1.8s ease-in-out infinite;
  }
  .caption {
    font-family: var(--font-body);
    font-style: italic;
    font-size: var(--fs-sm);
    color: var(--text-muted);
  }
  @keyframes carve {
    from {
      stroke-dashoffset: 1;
    }
    to {
      stroke-dashoffset: 0;
    }
  }
  @keyframes wait {
    50% {
      opacity: 0.45;
    }
  }
</style>
