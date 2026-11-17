<script lang="ts">
  /**
   * Čtveřicový glyf Lumenitů: čtyři strany čtverce = čtyři bity.
   * horní = 8, pravá = 4, dolní = 2, levá = 1. Rozsvícený střed (16) mají glyfy Síně Počtářů,
   * kosočtverec uprostřed (32) glyfy Zahrady Bran a čtvereček s tečkou (48) glyfy Hlubiny Strojů.
   */
  let { value, size = 24, label }: { value: number; size?: number; label?: string } = $props();

  const sides = [
    { bit: 3, d: 'M5 5H19' },
    { bit: 2, d: 'M19 5V19' },
    { bit: 1, d: 'M19 19H5' },
    { bit: 0, d: 'M5 19V5' },
  ];
</script>

<svg
  class="glyph"
  width={size}
  height={size}
  viewBox="0 0 24 24"
  role={label ? 'img' : undefined}
  aria-label={label}
  aria-hidden={label ? undefined : 'true'}
  focusable="false"
>
  {#each sides as s (s.bit)}
    <path d={s.d} class:lit={((value >> s.bit) & 1) === 1} />
  {/each}
  {#if (value & 48) === 48}
    <path class="lit gear" d="M9.4 9.4H14.6V14.6H9.4Z" />
    <circle class="lit hub" cx="12" cy="12" r="1" />
  {:else if value & 32}
    <path class="lit diamond" d="M12 8.6L15.4 12L12 15.4L8.6 12Z" />
  {:else}
    <circle cx="12" cy="12" r={value & 16 ? 2.6 : 1.6} class:lit={(value & 16) !== 0} />
  {/if}
</svg>

<style>
  .glyph {
    flex: none;
    display: inline-block;
    overflow: visible;
  }
  path {
    stroke: var(--umbra);
    stroke-opacity: 0.4;
    stroke-width: 2.4;
    stroke-linecap: round;
    fill: none;
  }
  path.gear {
    stroke-width: 1.6;
    stroke-linejoin: round;
  }
  circle.hub {
    fill: var(--lumen);
  }
  path.diamond {
    fill: var(--lumen);
    stroke-width: 1.4;
  }
  path.lit {
    stroke: var(--lumen);
    stroke-opacity: 1;
    filter: drop-shadow(0 0 2px rgba(255, 217, 138, 0.7));
  }
  circle {
    fill: var(--umbra);
    opacity: 0.6;
  }
  circle.lit {
    fill: var(--lumen);
    opacity: 1;
    filter: drop-shadow(0 0 2px rgba(255, 217, 138, 0.7));
  }
</style>
