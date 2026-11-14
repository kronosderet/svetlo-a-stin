<script lang="ts">
  import { fade } from 'svelte/transition';
  import { isBitSet, notationParts } from '../core/bits';
  import { settings } from '../game/settings.svelte.ts';

  interface Props {
    values: number[];
    bits: number;
    /** sum = rozklad na váhy; flips = červeně krystaly, které se proti předchozímu číslu změnily. */
    mode?: 'sum' | 'flips';
    /** Výchozí hodnota pro porovnání v režimu flips. */
    start?: number;
    empty: string;
  }

  let { values, bits, mode = 'sum', start = 0, empty }: Props = $props();

  const m = $derived(settings.reducedMotion ? 0 : 1);
  const positions = $derived(Array.from({ length: bits }, (_, k) => bits - 1 - k));
</script>

<!-- Zápisník badatele: moderní zápis na papíře. -->
<aside class="ledger parchment" aria-label="Zápisník">
  <h2>Zápisník</h2>
  <p class="sub">{mode === 'flips' ? 'změněné krystaly červeně' : 'moderní zápis'}</p>
  {#if values.length === 0}
    <p class="empty">{empty}</p>
  {/if}
  <ol>
    {#each values as v, k (k)}
      {@const n = notationParts(v, bits)}
      <li in:fade={{ duration: 500 * m }}>
        {#if mode === 'flips'}
          {@const prev = k === 0 ? start : values[k - 1]}
          <span class="flips" aria-label="{n.binary}, změněno {positions.filter((i) => isBitSet(v ^ prev, i)).length}">
            {#each positions as i (i)}<span class:flip={isBitSet(v ^ prev, i)}>{isBitSet(v, i) ? 1 : 0}</span>{/each}<sub>2</sub>
          </span>
          <span class="tail"><span class="op">=</span> <span class="val">{v}</span></span>
        {:else}
          <span class="bin">{n.binary}<sub>2</sub></span>
          <span class="op">=</span>
          {#if n.terms.length > 1}
            <span class="terms">{n.terms.join(' + ')}</span>
          {/if}
          <span class="tail">{#if n.terms.length > 1}<span class="op">=</span> {/if}<span class="val">{n.value}</span></span>
        {/if}
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
    gap: 8px;
    padding-bottom: 6px;
    border-bottom: 1px dashed rgba(92, 74, 51, 0.35);
  }
  .bin {
    font-weight: 700;
    color: var(--ink-red);
  }
  sub {
    font-size: 0.7em;
    color: var(--ink-muted);
  }
  .flips {
    letter-spacing: 0.06em;
    color: var(--ink-muted);
  }
  .flip {
    font-weight: 700;
    color: var(--ink-red);
    text-decoration: underline;
    text-decoration-thickness: 2px;
    text-underline-offset: 3px;
  }
  .op,
  .terms {
    color: var(--ink-muted);
  }
  .val {
    font-weight: 700;
    color: var(--ink);
  }
  .tail {
    display: inline-flex;
    gap: 8px;
    white-space: nowrap;
  }

  @media (max-width: 880px) {
    .ledger {
      min-height: 0;
      transform: none;
    }
  }
</style>
