<script lang="ts">
  type SealIcon = 'diamond' | 'star' | 'drop';

  /** delay: za kolik ms po zobrazení se získaná pečeť otiskne (na vítězné desce jedna po druhé). */
  let {
    earned,
    title,
    caption,
    icon,
    delay = 0,
  }: { earned: boolean; title: string; caption: string; icon: SealIcon; delay?: number } = $props();

  const icons: Record<SealIcon, string> = {
    diamond: 'M32 18 44 32 32 46 20 32Z',
    star: 'M32 16l4 12 12 4-12 4-4 12-4-12-12-4 12-4z',
    drop: 'M32 17c6 8 10 13 10 18.5a10 10 0 0 1-20 0C22 30 26 25 32 17z',
  };
  const notches = Array.from({ length: 24 }, (_, k) => k * 15);
</script>

<!-- Bronzový medailon; nezískaná pečeť je jen vytesaný otisk v kameni. -->
<div class="seal" class:earned style:--stamp-delay="{delay}ms">
  <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
    <circle class="coin" cx="32" cy="32" r="28" />
    {#each notches as deg (deg)}
      <line x1="32" y1="5.5" x2="32" y2="9" transform="rotate({deg} 32 32)" />
    {/each}
    <circle class="rim" cx="32" cy="32" r="21" />
    <path class="emblem" d={icons[icon]} />
  </svg>
  <span class="t">{title}</span>
  <span class="c">{caption}</span>
  <span class="visually-hidden">{earned ? 'získána' : 'nezískána'}</span>
</div>

<style>
  .seal {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    min-width: 0;
    text-align: center;
  }
  svg {
    width: 66px;
    height: 66px;
    margin-bottom: 6px;
    overflow: visible;
  }
  .coin {
    fill: rgba(8, 6, 4, 0.5);
    stroke: rgba(0, 0, 0, 0.6);
    stroke-width: 1.5;
    filter: drop-shadow(0 1px 0 rgba(255, 236, 200, 0.08));
  }
  line {
    stroke: rgba(0, 0, 0, 0.55);
    stroke-width: 1.5;
  }
  .rim {
    fill: none;
    stroke: rgba(0, 0, 0, 0.5);
    stroke-width: 1.5;
  }
  .emblem {
    fill: none;
    stroke: var(--stone-400);
    stroke-width: 2;
    stroke-linejoin: round;
  }
  .earned .coin {
    fill: url(#bronze);
    stroke: #3d2c0c;
  }
  .earned line {
    stroke: rgba(61, 44, 12, 0.7);
  }
  .earned .rim {
    stroke: rgba(61, 44, 12, 0.6);
  }
  .earned .emblem {
    fill: rgba(61, 44, 12, 0.25);
    stroke: #2e1f06;
  }
  .earned svg {
    filter: drop-shadow(0 3px 2px rgba(0, 0, 0, 0.6)) drop-shadow(0 0 12px rgba(242, 193, 78, 0.35));
    animation: stamp 650ms cubic-bezier(0.2, 1.6, 0.4, 1) both var(--stamp-delay, 0ms);
  }
  .t {
    font-family: var(--font-display);
    font-size: var(--fs-md);
    font-weight: 700;
  }
  .c {
    font-size: var(--fs-sm);
    color: var(--text-muted);
  }
  @keyframes stamp {
    from {
      transform: scale(1.6) rotate(-20deg);
      opacity: 0;
    }
    to {
      transform: scale(1) rotate(0);
      opacity: 1;
    }
  }
</style>
