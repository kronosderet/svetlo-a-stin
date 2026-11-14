<script lang="ts">
  import { isBitSet } from '../core/bits';

  interface Props {
    mask: number;
    bits: number;
    size?: 'sm' | 'md' | 'lg';
    digits?: boolean;
    label?: string;
  }

  let { mask, bits, size = 'md', digits = false, label }: Props = $props();

  const positions = $derived(Array.from({ length: bits }, (_, k) => bits - 1 - k));
</script>

<span class="mini {size}" role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : 'true'}>
  {#each positions as i (i)}
    <span class="cell">
      <svg viewBox="0 0 20 32" focusable="false">
        <polygon points="10,1.5 18.5,9 18.5,23 10,30.5 1.5,23 1.5,9" class:lit={isBitSet(mask, i)} />
      </svg>
      {#if digits}<span class="d carved" class:lit={isBitSet(mask, i)}>{isBitSet(mask, i) ? 1 : 0}</span>{/if}
    </span>
  {/each}
</span>

<style>
  .mini {
    display: inline-flex;
    align-items: flex-end;
    gap: 6px;
  }
  .cell {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
  }
  svg {
    display: block;
    overflow: visible;
  }
  .sm svg {
    width: 11px;
  }
  .md svg {
    width: 17px;
  }
  .lg svg {
    width: 30px;
  }
  .lg {
    gap: 14px;
  }
  polygon {
    fill: url(#gem-off);
    stroke: var(--umbra);
    stroke-width: 1.8;
    stroke-linejoin: round;
  }
  polygon.lit {
    fill: url(#gem-on);
    stroke: #ffe9b0;
    filter: drop-shadow(0 0 4px rgba(255, 210, 130, 0.65));
  }
  .d {
    font-family: var(--font-mono);
    font-size: var(--fs-xs);
    font-weight: 700;
    color: var(--text-muted);
    line-height: 1;
  }
  .lg .d {
    font-size: var(--fs-md);
  }
  .d.lit {
    color: var(--lumen-glow);
  }
</style>
