<script lang="ts">
  import { fade } from 'svelte/transition';
  import Arrow from '../Arrow.svelte';
  import Rich from '../Rich.svelte';
  import { toBinaryString } from '../../core/bits';
  import { taskStart, type TideConfig, type TideOp } from '../../core/puzzles/tide';
  import { settings } from '../../game/settings.svelte.ts';

  interface Props {
    cfg: TideConfig;
    trails: TideOp[][];
    /** Jak se páky zapisují: šipkami (posun teprve objevuješ), nebo ×2, ÷2, +1, −1. */
    levers: 'shift' | 'math';
  }

  let { cfg, trails, levers }: Props = $props();

  const m = $derived(settings.reducedMotion ? 0 : 1);
  const MARK: Record<'shift' | 'math', Record<TideOp, string>> = {
    shift: { shl: '←', shr: '→', inc: '+1', dec: '−1', not: '¬' },
    math: { shl: '×2', shr: '÷2', inc: '+1', dec: '−1', not: '¬' },
  };
</script>

<!-- Zápisník: odkud kam a kterými pákami. -->
<aside class="ledger parchment" aria-label="Zápisník">
  <h2>Zápisník</h2>
  <p class="sub">{levers === 'shift' ? 'moderní zápis' : 'cesta pákami'}</p>
  {#if trails.length === 0}
    <p class="empty">Zatím prázdný. Každou splněnou zkoušku si sem zapíšeš.</p>
  {/if}
  <ol>
    {#each trails as trail, k (k)}
      {@const from = taskStart(cfg, k)}
      {@const to = cfg.tasks[k].target}
      <li in:fade={{ duration: 500 * m }}>
        <span class="path">
          <span class="bin">{toBinaryString(from, cfg.bits)}</span>
          <span class="arrow"><Arrow label="na" /></span>
          <span class="bin to">{toBinaryString(to, cfg.bits)}<sub>2</sub></span>
        </span>
        <span class="dec">{from} <Arrow label="na" /> {to}</span>
        <span class="ops" aria-label="páky: {trail.map((o) => MARK.math[o]).join(', ')}">
          {#each trail as op, j (j)}<span class="op"><Rich text={MARK[levers][op]} /></span>{/each}
        </span>
      </li>
    {/each}
  </ol>
</aside>

<style>
  .ledger {
    align-self: center;
    min-height: 210px;
    padding: 18px 20px 20px;
    border-radius: 4px;
    transform: rotate(0.6deg);
  }
  h2 {
    margin: 0;
    font-size: var(--fs-lg);
    color: var(--ink);
  }
  .sub {
    margin: 0 0 10px;
    font-family: var(--font-body);
    font-style: italic;
    font-size: var(--fs-sm);
    color: var(--ink-muted);
  }
  .empty {
    margin: 0;
    font-size: var(--fs-sm);
    color: var(--ink-muted);
  }
  ol {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin: 0;
    padding: 0;
    list-style: none;
    font-family: var(--font-mono);
    font-size: var(--fs-md);
  }
  li {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 2px 10px;
    padding-bottom: 7px;
    border-bottom: 1px dashed rgba(92, 74, 51, 0.35);
  }
  .path {
    display: inline-flex;
    gap: 6px;
    white-space: nowrap;
  }
  .bin {
    color: var(--ink-muted);
  }
  .bin.to {
    font-weight: 700;
    color: var(--ink-red);
  }
  .arrow,
  sub {
    color: var(--ink-muted);
  }
  sub {
    font-size: 0.7em;
  }
  .dec {
    font-weight: 700;
    color: var(--ink);
  }
  .ops {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    width: 100%;
  }
  .op {
    padding: 0 5px;
    border: 1px solid rgba(92, 74, 51, 0.45);
    border-radius: 3px;
    font-size: var(--fs-sm);
    color: var(--ink);
  }
  @media (max-width: 880px) {
    .ledger {
      min-height: 0;
      transform: none;
    }
  }
</style>
