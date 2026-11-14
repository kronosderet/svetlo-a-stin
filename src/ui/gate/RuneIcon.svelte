<script lang="ts">
  import type { Rune } from '../../core/logic';
  import { RUNE_PATH } from '../../content/runes';

  /** Runa vytesaná do kamene; null = prázdný kámen (otazník). */
  let { rune, size = 34 }: { rune: Rune | null; size?: number } = $props();
</script>

<svg class="rune" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
  {#if rune}
    <path d={RUNE_PATH[rune]} />
  {:else}
    <text x="12" y="17" text-anchor="middle">?</text>
  {/if}
</svg>

<style>
  .rune {
    display: block;
    overflow: visible;
  }
  path {
    fill: none;
    stroke: currentColor;
    stroke-width: 2.6;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  text {
    font-family: var(--font-display);
    font-size: 15px;
    font-weight: 700;
    fill: currentColor;
    opacity: 0.6;
  }
</style>
