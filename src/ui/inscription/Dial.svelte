<script lang="ts">
  import { fly } from 'svelte/transition';
  import Glyph from '../Glyph.svelte';
  import Icon from '../Icon.svelte';
  import { toHex } from '../../core/bits';
  import { settings } from '../../game/settings.svelte.ts';

  interface Props {
    value: number;
    wheels: number;
    disabled?: boolean;
    /** 10 = číslice, 16 = glyfy (každý kotouč nese jednu čtveřici krystalů). */
    radix?: 10 | 16;
    onNudge: (wheel: number, delta: number) => void;
  }

  let { value, wheels, disabled = false, radix = 10, onNudge }: Props = $props();

  const PLACES = ['jednotky', 'desítky', 'stovky'];
  const QUARTETS = ['pravá čtveřice', 'levá čtveřice'];

  const m = $derived(settings.reducedMotion ? 0 : 1);
  const order = $derived(Array.from({ length: wheels }, (_, w) => w));
  /** Směr posledního otočení každého kotouče (+1 nahoru, −1 dolů) pro animaci. */
  let dirs: number[] = $state([]);

  function digitAt(w: number): number {
    return Math.floor(value / radix ** (wheels - 1 - w)) % radix;
  }

  function place(w: number): string {
    if (radix === 16) return wheels === 1 ? 'glyf' : (QUARTETS[wheels - 1 - w] ?? `glyf ${w + 1}`);
    return PLACES[wheels - 1 - w] ?? `řád ${wheels - w}`;
  }

  const face = (d: number): string => (radix === 16 ? toHex(d) : String(d));

  function nudge(w: number, delta: number) {
    if (disabled) return;
    dirs[w] = delta;
    onNudge(w, delta);
  }

  function onKey(e: KeyboardEvent, w: number) {
    if (e.key === 'ArrowUp') nudge(w, 1);
    else if (e.key === 'ArrowDown') nudge(w, -1);
    else return;
    e.preventDefault();
  }
</script>

<!-- Kamenné kotouče s vykládanými číslicemi, jako zámek s heslem. -->
<div class="dial stone" class:glyphs={radix === 16} role="group" aria-label="Kotouče, nastaveno {radix === 16 ? toHex(value, wheels) : value}">
  {#each order as w (w)}
    {@const d = digitAt(w)}
    {@const dir = dirs[w] ?? 1}
    <div class="wheel">
      <button type="button" class="nudge" {disabled} aria-label="{place(w)} o jedna víc" onclick={() => nudge(w, 1)}>
        <Icon name="up" size={22} />
      </button>
      <div
        class="drum stone-inset"
        role="spinbutton"
        tabindex={disabled ? -1 : 0}
        aria-label="Kotouč: {place(w)}"
        aria-valuenow={d}
        aria-valuetext={face(d)}
        aria-valuemin={0}
        aria-valuemax={radix - 1}
        onkeydown={(e) => onKey(e, w)}
      >
        <span class="ghost above" aria-hidden="true">{face((d + radix - 1) % radix)}</span>
        {#key d}
          <span
            class="digit inlaid"
            in:fly={{ y: 30 * dir, duration: 260 * m }}
            out:fly={{ y: -30 * dir, duration: 260 * m }}
          >
            {#if radix === 16}
              <span class="glyph-face"><Glyph value={d} size={42} /><span class="hexch">{face(d)}</span></span>
            {:else}{d}{/if}
          </span>
        {/key}
        <span class="ghost below" aria-hidden="true">{face((d + 1) % radix)}</span>
      </div>
      <button type="button" class="nudge" {disabled} aria-label="{place(w)} o jedna méně" onclick={() => nudge(w, -1)}>
        <Icon name="down" size={22} />
      </button>
    </div>
  {/each}
</div>

<style>
  .dial {
    display: flex;
    gap: 12px;
    padding: 10px 16px;
    border-radius: 14px;
  }
  .wheel {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }
  .nudge {
    display: grid;
    place-items: center;
    width: 60px;
    height: 34px;
    border: 0;
    border-radius: 8px;
    background: transparent;
    color: var(--text-muted);
    cursor: pointer;
    transition:
      color var(--t-fast),
      background var(--t-fast);
  }
  .nudge:hover:not(:disabled) {
    color: var(--lumen);
    background: rgba(255, 236, 200, 0.06);
  }
  .nudge:active:not(:disabled) {
    transform: translateY(1px);
  }
  .nudge:disabled {
    opacity: 0.4;
    cursor: default;
  }
  /* Válec: v okénku jedna číslice, nad a pod ní sousedé ve stínu. */
  .drum {
    position: relative;
    display: grid;
    place-items: center;
    width: 60px;
    height: 104px;
    overflow: hidden;
    border-radius: 8px;
    background-image:
      linear-gradient(180deg, rgba(0, 0, 0, 0.7), transparent 32%, transparent 68%, rgba(0, 0, 0, 0.7)),
      var(--tex-grain);
  }
  .drum:focus-visible {
    outline: 2px solid var(--lumen);
    outline-offset: 3px;
  }
  .digit {
    grid-area: 1 / 1;
    font-family: var(--font-display);
    font-size: var(--fs-3xl);
    font-weight: 700;
    line-height: 1;
  }
  .glyph-face {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
  }
  .hexch {
    font-family: var(--font-mono);
    font-size: var(--fs-base);
    font-weight: 700;
  }
  .glyphs .drum {
    width: 76px;
    height: 124px;
  }
  .glyphs .nudge {
    width: 76px;
  }
  .ghost {
    position: absolute;
    left: 0;
    right: 0;
    text-align: center;
    font-family: var(--font-display);
    font-size: var(--fs-md);
    font-weight: 700;
    line-height: 1;
    color: var(--stone-400);
    opacity: 0.7;
    pointer-events: none;
  }
  .above {
    top: 6px;
  }
  .below {
    bottom: 6px;
  }
</style>
