<script lang="ts">
  /** Šipka v textu. Fonty hry znak → nemají, tak ji kreslíme, aby byla všude stejná. */
  let { dir = 'right', label }: { dir?: 'left' | 'right'; label?: string } = $props();
</script>

<svg
  class="arrow"
  viewBox="0 0 18 10"
  role={label ? 'img' : undefined}
  aria-label={label}
  aria-hidden={label ? undefined : 'true'}
  focusable="false"
>
  <path d={dir === 'right' ? 'M1.5 5H16M12 1.5L16 5L12 8.5' : 'M16.5 5H2M6 1.5L2 5L6 8.5'} />
</svg>

<style>
  .arrow {
    display: inline-block;
    width: 1.05em;
    height: 0.6em;
    margin: 0 0.05em;
    vertical-align: 0.08em;
    overflow: visible;
  }
  path {
    fill: none;
    stroke: currentColor;
    stroke-width: 1.7;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
</style>
