<script lang="ts">
  /** Malý krystal zasazený ve stěně: chrám ho rozsvítí, hráč na něj nesahá. */
  let { on, digit = false }: { on: boolean; digit?: boolean } = $props();
</script>

<span class="gem" class:on aria-hidden="true">
  <svg viewBox="0 0 20 32" focusable="false">
    <polygon points="10,1.5 18.5,9 18.5,23 10,30.5 1.5,23 1.5,9" />
    <path d="M10 1.5V8M18.5 9L14 11M18.5 23L14 21M10 30.5V24M1.5 23L6 21M1.5 9L6 11" />
  </svg>
  {#if digit}<span class="d carved">{on ? 1 : 0}</span>{/if}
</span>

<style>
  .gem {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
  }
  svg {
    display: block;
    width: var(--gem-w, 20px);
    overflow: visible;
  }
  polygon {
    fill: url(#gem-off);
    stroke: var(--umbra);
    stroke-width: 1.6;
    stroke-linejoin: round;
    transition:
      fill var(--t-fast),
      stroke var(--t-fast);
  }
  path {
    fill: none;
    stroke: var(--umbra);
    stroke-opacity: 0.35;
    stroke-width: 1;
  }
  .on polygon {
    fill: url(#gem-on);
    stroke: #ffe9b0;
    filter: drop-shadow(0 0 5px rgba(255, 210, 130, 0.7));
  }
  .on path {
    stroke: #fff6dc;
    stroke-opacity: 0.55;
  }
  .d {
    font-family: var(--font-mono);
    font-size: var(--fs-xs);
    font-weight: 700;
    line-height: 1;
    color: var(--text-muted);
  }
  .on .d {
    color: var(--lumen-glow);
  }
</style>
