<script lang="ts" module>
  export type WeightState = 'hidden' | 'unknown' | 'known';
</script>

<script lang="ts">
  import Crystal from './Crystal.svelte';
  import { isBitSet } from '../core/bits';

  interface Props {
    bits: number;
    mask: number;
    weightState: (i: number) => WeightState;
    sizes?: 'equal' | 'weighted';
    digits: boolean;
    highlight?: number | null;
    disabled: boolean;
    celebrate?: boolean;
    label: string;
    crystalLabel: (i: number, k: number) => string;
    onToggle: (i: number) => void;
  }

  let {
    bits,
    mask,
    weightState,
    sizes = 'equal',
    digits,
    highlight = null,
    disabled,
    celebrate = false,
    label,
    crystalLabel,
    onToggle,
  }: Props = $props();

  const positions = $derived(Array.from({ length: bits }, (_, k) => bits - 1 - k));

  function scaleFor(i: number): number {
    if (sizes === 'equal' || bits === 1) return 1;
    return 0.64 + 0.36 * (i / (bits - 1));
  }
</script>

<!-- Velikost krystalů se řídí šířkou místa, ne okna: osm krystalů se vejde i vedle zápisníku. -->
<div class="row" class:byte={bits >= 7}>
  <div class="crystals" role="group" aria-label={label} style:--n={bits}>
    {#each positions as i, k (i)}
      <Crystal
        on={isBitSet(mask, i)}
        weight={2 ** i}
        weightState={weightState(i)}
        scale={scaleFor(i)}
        digit={digits}
        highlight={highlight === i}
        {disabled}
        {celebrate}
        delay={k * 90}
        label={crystalLabel(i, k)}
        onToggle={() => onToggle(i)}
      />
    {/each}
  </div>
</div>

<style>
  .row {
    width: 100%;
    container-type: inline-size;
  }
  .crystals {
    --per-row: var(--n);
    --crystal-w: min(104px, calc(70cqi / var(--per-row)), 11vh);
    display: grid;
    grid-template-columns: repeat(var(--per-row), auto);
    justify-content: center;
    align-items: end;
    gap: 12px min(22px, 2.4cqi);
  }
  /* Oktáva (bajt) se čte po čtveřicích: mezi nimi je větší mezera. */
  .byte .crystals > :global(:nth-child(5)) {
    margin-left: min(28px, 3cqi);
  }
  @container (max-width: 620px) {
    .byte .crystals {
      --per-row: 4;
    }
    .byte .crystals > :global(:nth-child(5)) {
      margin-left: 0;
    }
  }
</style>
